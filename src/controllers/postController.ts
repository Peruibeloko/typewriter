import { RequestHandler } from 'express';
import Post from '../models/postModel.js';
import { printMarkdownToHTML } from '../util/converter.js';

export const getPaginatedPosts: RequestHandler = (req, res) => {
  const hasValidBounds = ![isNaN(Number(req.query.page)), isNaN(Number(req.query.limit))].includes(
    true
  );

  if (!hasValidBounds) return res.status(400).send('Invalid bounds');

  const page = Number(req.params.page);
  const limit = Number(req.params.limit);

  Post.find({}, 'createdAt title author')
    .sort('-createdAt')
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

export const createPost: RequestHandler = (req, res) => {
  const newPost = new Post({ ...req.body });
  newPost
    .save()
    .then(({ _id }) => res.status(201).json(_id))
    .catch(err => res.status(500).send(err.message));
};

export const countPosts: RequestHandler = (_req, res) => {
  Post.countDocuments()
    .exec()
    .then(count => res.json(count))
    .catch(err => res.status(500).send(err.message));
};

export const getLatestPostId: RequestHandler = async (_req, res) => {
  if ((await Post.countDocuments().exec()) === 0)
    return res.status(404).send('There are no documents');

  Post.findOne({}, 'id')
    .sort('-createdAt')
    .lean()
    .exec()
    .then(doc => res.send(doc._id))
    .catch(err => res.status(500).send(err.message));
};
export const getFirstPostId: RequestHandler = async (_req, res) => {
  if ((await Post.countDocuments().exec()) === 0)
    return res.status(404).send('There are no documents');

  Post.findOne({}, 'id')
    .sort('createdAt')
    .lean()
    .exec()
    .then(doc => res.send(doc._id))
    .catch(err => res.status(500).send(err.message));
};

export const getRandomPostId: RequestHandler = async (_req, res) => {
  if ((await Post.countDocuments().exec()) === 0)
    return res.status(404).send('There are no documents');

  Post.aggregate()
    .sample(1)
    .exec()
    .then(doc => res.send(doc[0]))
    .catch(err => res.status(500).send(err.message));
};

export const getPostById: RequestHandler = async (req, res) => {
  const postData = await Post.findById(req.params.id)
    .populate({
      path: 'author',
      select: 'displayName',
      strictPopulate: false,
      transform: doc => doc.displayName
    })
    .lean()
    .exec();

  if (!postData) return res.status(404).send(`Post with id ${req.params.id} doesn't exist`);

  const { prevPostId, nextPostId } = await getNeighbouringPostsByTimestamp(postData.createdAt);

  const { post, ...postMetadata } = postData;
  const result = {
    postData: {
      ...postMetadata,
      content: printMarkdownToHTML(post)
    },
    prevPostId,
    nextPostId
  };

  res.json(result);
};

export const updatePost: RequestHandler = async (req, res) => {
  const postAuthor = await Post.findById(req.params.id, 'author')
    .lean()
    .exec()
    .then(val => val?.author);

  if (postAuthor !== req.userInfo.email)
    return res.status(403).send("You're not allowed to edit other users posts");

  Post.updateOne({ id: req.params.id }, req.body)
    .exec()
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err.message));
};

export const deletePost: RequestHandler = async (req, res) => {
  const postAuthor = await Post.findById(req.params.id, 'author')
    .populate({
      path: 'author',
      select: 'id',
      strictPopulate: false,
      transform: doc => doc._id
    })
    .exec()
    .then(val => val._id.toString());

  if (postAuthor !== req.userInfo.email)
    return res.status(403).send("You're not allowed to delete other users posts");

  Post.deleteOne({ id: req.params.id })
    .exec()
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err.message));
};

export const getNextPostId: RequestHandler = async (req, res) => {
  const currentPost = await Post.findById(req.params.id, 'createdAt').lean().exec();

  const nextPost = await Post.findOne({ createdAt: { $gt: currentPost.createdAt } }, 'id')
    .sort('-createdAt')
    .exec();

  if (!nextPost) return res.sendStatus(404);
  res.json(nextPost._id);
};

export const getPreviousPostId: RequestHandler = async (req, res) => {
  const currentPost = await Post.findById(req.params.id, 'createdAt').lean().exec();

  const prevPost = await Post.findOne({ createdAt: { $lt: currentPost.createdAt } }, 'id')
    .sort('-createdAt')
    .exec();

  if (!prevPost) return res.sendStatus(404);
  res.json(prevPost._id);
};

const getNeighbouringPostsByTimestamp = async (timestamp: Date) => {
  const [prevPostId, nextPostId] = await Promise.all([
    Post.findOne({ createdAt: { $lt: timestamp } }, 'id')
      .sort('-createdAt')
      .lean()
      .exec(),
    Post.findOne({ createdAt: { $gt: timestamp } }, 'id')
      .sort('createdAt')
      .lean()
      .exec()
  ]).then(promises => promises.map(promise => promise._id));

  return { prevPostId, nextPostId };
};
