import Draft from '../models/draftModel.js';

export const getPaginatedDrafts = (req, res) => {
  const { page = 1, limit = 10 } = req.query;

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
    .exec()
    .then(docs => res.send(docs))
    .catch(err => res.status(500).send(err.message));
};

export const getDraftById = async (req, res) => {
  try {
    const postData = await Draft.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'displayName id',
        strictPopulate: false
      })
      .exec()
      .then(val => val._doc);

    if (!postData) return res.status(404).send(`Draft with id ${req.params.id} doesn't exist`);

    if (postData.author._id !== req.userInfo.email)
      return res.status(403).send("You're not allowed to view other users drafts");

    res.json({ ...postData, author: postData.author.displayName });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createDraft = (req, res) => {
  if (!(req.body.content || req.body.title))
    return res.status(500).send('Either title, content or both must be filled');

  const newDraft = new Draft({ ...req.body, author: req.userInfo.email });
  newDraft
    .save()
    .then(({ _id }) => res.status(201).json(_id))
    .catch(err => res.status(500).send(err.message));
};

export const updateDraft = async (req, res) => {
  if (!(req.body.content || req.body.title))
    return res.status(500).send('Either title, content or both must be filled');

  const authorId = await Draft.findById(req.params.id)
    .populate({
      path: 'author',
      select: 'id',
      strictPopulate: false,
      transform: doc => doc._id
    })
    .exec()
    .then(val => val._doc);

  if (authorId !== req.userInfo.email)
    return res.status(403).send("You're not allowed to edit other users drafts");

  Draft.updateOne({ id: req.params.id }, req.body)
    .exec()
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err.message));
};

export const deleteDraft = async (req, res) => {
  const authorId = await Draft.findById(req.params.id)
    .populate({
      path: 'author',
      select: 'id',
      strictPopulate: false,
      transform: doc => doc._id
    })
    .exec()
    .then(val => val._doc);

  if (authorId !== req.userInfo.email)
    return res.status(403).send("You're not allowed to delete other users drafts");

  Draft.deleteOne({ id: req.params.id })
    .exec()
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err.message));
};
