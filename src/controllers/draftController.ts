import { RequestHandler } from 'express';
import Draft from '../models/draftModel.js';
import { IUser } from '../models/userModel.js';

export const getPaginatedDrafts: RequestHandler = (req, res) => {
  const hasValidBounds = ![isNaN(Number(req.query.page)), isNaN(Number(req.query.limit))].includes(
    true
  );

  if (!hasValidBounds) return res.status(400).send('Invalid bounds');

  const page = Number(req.params.page);
  const limit = Number(req.params.limit);

  Draft.find(
    {
      author: {
        $eq: req.userInfo.email
      }
    },
    'id title updatedAt createdAt'
  )
    .sort('-updatedAt')
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'author',
      select: 'displayName',
      strictPopulate: false,
      transform: doc => doc.displayName
    })
    .lean()
    .exec()
    .then(docs => res.send(docs))
    .catch(err => res.status(500).send(err.message));
};

export const getDraftById: RequestHandler = async (req, res) => {
  const draftData = await Draft.findById(req.params.id)
    .populate({
      path: 'author',
      select: 'displayName id',
      strictPopulate: false
    })
    .lean()
    .exec();

  if (!draftData) return res.status(404).send(`Draft with id ${req.params.id} doesn't exist`);

  if ((draftData.author as IUser)._id !== req.userInfo.email)
    return res.status(403).send("You're not allowed to view other users drafts");

  res.json({ ...draftData, author: (draftData.author as IUser).displayName });
};

export const createDraft: RequestHandler = (req, res) => {
  if (!(req.body.content || req.body.title))
    return res.status(400).send('Either title, content or both must be filled');

  const newDraft = new Draft({ ...req.body, author: req.userInfo.email });
  newDraft
    .save()
    .then(({ _id }) => res.status(201).json(_id))
    .catch(err => res.status(500).send(err.message));
};

export const updateDraft: RequestHandler = async (req, res) => {
  if (!(req.body.content || req.body.title))
    return res.status(500).send('Either title, content or both must be filled');

  const authorId = await Draft.findById(req.params.id)
    .exec()
    .then(doc => doc?.author);

  if (authorId !== req.userInfo.email)
    return res.status(403).send("You're not allowed to edit other users drafts");

  Draft.updateOne({ id: req.params.id }, req.body)
    .exec()
    .then(() => res.sendStatus(200));
};

export const deleteDraft: RequestHandler = async (req, res) => {
  const authorId = await Draft.findById(req.params.id)
    .exec()
    .then(doc => doc?._id.toString());

  if (authorId !== req.userInfo.email)
    return res.status(403).send("You're not allowed to delete other users drafts");

  Draft.deleteOne({ id: req.params.id })
    .exec()
    .then(() => res.sendStatus(200));
};
