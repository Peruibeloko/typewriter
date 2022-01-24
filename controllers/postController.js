import { parseMarkdown } from '../classes/converter.js';
import Post from '../models/postModel.js';

export const getPaginatedPosts = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const results = await Post.find()
      .sort('-datetime')
      .skip(page - 1 ?? 0)
      .limit(limit ?? 10)
      .exec();

    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getNextPostAfter = async (req, res) => {
  try {
    const result = await Post.findOne().sort('-datetime').lt('datetime', req.params.offset).exec();

    const response = {
      ...result,
      post: parseMarkdown(result.post)
    };

    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getPostByDate = async (req, res) => {
  try {
    const result = await Post.findOne({ datetime: new Date(req.params.date) }).exec();

    const response = {
      ...result,
      post: parseMarkdown(result.post)
    };

    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getLatestPost = async (req, res) => {
  try {
    const result = await Post.findOne().sort('-datetime').exec();
    const response = {
      ...result,
      post: parseMarkdown(result.post)
    };
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createPost = async (req, res) => {
  const newPost = new Post({ ...req.body });
  try {
    await newPost.save();
    res.status(201).end();
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updatePost = async (req, res) => {
  try {
    await Post.updateOne({ timestamp: req.params.timestamp });
    res.status(200).end();
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    Post.deleteOne({ timestamp: req.params.timestamp });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getFieldsFromAllPosts = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const results = await Post.find()
      .sort('-datetime')
      .skip(page - 1 ?? 0)
      .limit(limit ?? 10)
      .projection(req.body.fields)
      .exec();

    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const countPosts = async (req, res) => {
  try {
    Post.countDocuments();
  } catch (err) {
    res.status(500).send(err);
  }
};
