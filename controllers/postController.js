import Post from '../models/postModel.js';
import { printMarkdownToHTML } from '../util/converter.js';

export const getPaginatedPosts = (req, res) => {
  const { page = 1, limit = 10 } = req.query;

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
    .exec()
    .then(docs => res.send(docs))
    .catch(err => res.status(500).send(err.message));
};

export const createPost = (req, res) => {
  const newPost = new Post({ ...req.body });
  newPost
    .save()
    .then(({ _id }) => res.status(201).json(_id))
    .catch(err => res.status(500).send(err.message));
};

export const countPosts = (_req, res) => {
  Post.countDocuments()
    .exec()
    .then(count => res.json(count))
    .catch(err => res.status(500).send(err.message));
};

export const getLatestPostId = (_req, res) => {
  Post.findOne({}, 'id')
    .sort('-createdAt')
    .exec()
    .then(({ _id }) => res.json(_id))
    .catch(err => res.status(500).send(err.message));
};
export const getFirstPostId = (_req, res) => {
  Post.findOne({}, 'id')
    .sort('createdAt')
    .exec()
    .then(({ _id }) => res.json(_id))
    .catch(err => res.status(500).send(err.message));
};

export const getRandomPostId = async (_req, res) => {
  const count = await Post.countDocuments().exec();
  const chosen = Math.floor(Math.random() * count);

  Post.findOne({}, 'id')
    .skip(chosen)
    .limit(1)
    .exec()
    .then(({ _id }) => res.send(_id))
    .catch(err => res.status(500).send(err.message));
};

export const getPostById = async (req, res) => {
  const { post: postContent, ...postData } = await Post.findById(req.params.id)
    .populate({
      path: 'author',
      select: 'displayName',
      strictPopulate: false,
      transform: doc => doc.displayName
    })
    .exec()
    .then(val => val._doc);

  if (!postData) return res.status(404).send(`Post with id ${req.params.id} doesn't exist`);

  const { prevPostId, nextPostId } = await getNeighbouringPostsByTimestamp(postData.createdAt);

  const result = {
    postData: {
      ...postData,
      content: printMarkdownToHTML(postContent)
    },
    prevPostId,
    nextPostId
  };

  res.json(result);
};

export const updatePost = async (req, res) => {
  const postAuthor = await Post.findById(req.params.id, 'author')
    .populate({
      path: 'author',
      select: 'id',
      strictPopulate: false,
      transform: doc => doc._id
    })
    .exec()
    .then(val => val._doc);

  if (postAuthor !== req.userInfo.email)
    return res.status(403).send("You're not allowed to edit other users posts");

  Post.updateOne({ id: req.params.id }, req.body)
    .exec()
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err.message));
};

export const deletePost = async (req, res) => {
  const postAuthor = await Post.findById(req.params.id, 'author')
    .populate({
      path: 'author',
      select: 'id',
      strictPopulate: false,
      transform: doc => doc._id
    })
    .exec()
    .then(val => val._doc);

  if (postAuthor !== req.userInfo.email)
    return res.status(403).send("You're not allowed to delete other users posts");

  Post.deleteOne({ id: req.params.id })
    .exec()
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err.message));
};

export const getNextPostId = async (req, res) => {
  const { _doc: currentPost } = await Post.findById(req.params.id, 'createdAt');

  const nextPost = await Post.findOne({ createdAt: { $gt: currentPost.createdAt } }, 'id')
    .sort('-createdAt')
    .exec();

  if (!nextPost) return res.sendStatus(404);
  res.json(nextPost._id);
};

export const getPreviousPostId = async (req, res) => {
  const { _doc: currentPost } = await Post.findById(req.params.id, 'createdAt');

  const prevPost = await Post.findOne({ createdAt: { $lt: currentPost.createdAt } }, 'id')
    .sort('-createdAt')
    .exec();

  if (!prevPost) return res.sendStatus(404);
  res.json(prevPost._id);
};

const getNeighbouringPostsByTimestamp = async timestamp => {
  const promises = await Promise.allSettled([
    await Post.findOne({ createdAt: { $lt: timestamp } }, 'id')
      .sort('-createdAt')
      .exec(),
    await Post.findOne({ createdAt: { $gt: timestamp } }, 'id')
      .sort('createdAt')
      .exec()
  ]).then(promises => promises.map(promise => promise.value?._id ?? null));

  return { prevPostId: promises[0], nextPostId: promises[1] };
};
