import { printMarkdownToHTML } from '../util/converter.js';
import Post from '../models/postModel.js';

export const getPaginatedPosts = async (req, res) => {
  const { page = 0, limit = 10 } = req.query;

  try {
    const results = await Post.find()
      .select('_id title datetime author')
      .sort('-datetime')
      .skip(page * limit)
      .limit(limit)
      .exec();

    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createPost = async (req, res) => {
  const newPost = new Post({ ...req.body });
  try {
    await newPost.save();
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const countPosts = async (req, res) => {
  try {
    res.json(count);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getLatestPostId = async (req, res) => {
  try {
    const { _id: lastPostId } = await Post.findOne({}, 'id').sort('-datetime').exec();
    res.send(lastPostId);
  } catch (err) {
    res.status(500).send(err);
  }
};
export const getFirstPostId = async (req, res) => {
  try {
    const { _id: firstPostId } = await Post.findOne({}, 'id').sort('datetime').exec();
    res.send(firstPostId);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getRandomPostId = async (req, res) => {
  try {
    const count = await Post.countDocuments().exec();
    const chosen = Math.floor(Math.random() * count) - 1;

    const { _id: postId } = await Post.findOne({}, 'id').skip(chosen).limit(1).exec();

    res.send(postId);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    res.locals.doc = await Post.findById(parseInt(req.params.id)).exec();

    if (!res.locals.doc) res.status(404).send(`Post with id ${req.params.id} doesn't exist`).end();

    next();
  } catch (err) {
    res.status(500).send(err);
  }
};
export const updatePost = async (req, res) => {
  try {
    await Post.updateOne({ id: req.params.id });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    Post.deleteOne({ id: req.params.id });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getNextPostId = async (req, res) => {
  try {
    const { _doc: currentPost } = await Post.findById(req.params.id, 'datetime');

    const nextPost = await Post.findOne({ datetime: { $gt: currentPost.datetime } }, 'id')
      .sort('-datetime')
      .exec();

    if (!nextPost) res.sendStatus(404).end();
    res.send(nextPost._id).end();
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getPreviousPostId = async (req, res) => {
  try {
    const { _doc: currentPost } = await Post.findById(req.params.id, 'datetime');

    const prevPost = await Post.findOne({ datetime: { $lt: currentPost.datetime } }, 'id')
      .sort('-datetime')
      .exec();

    if (!prevPost) res.sendStatus(404).end();
    res.send(prevPost._id).end();
  } catch (err) {
    res.status(500).send(err);
  }
};
