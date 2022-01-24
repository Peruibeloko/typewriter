import { parseMarkdown } from '../classes/converter.js';
import Post from '../models/postModel.js';

export const getPaginatedPosts = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const results = await Post.find()
      .sort('-datetime')
      .skip(page * (limit || 10) || 0)
      .limit(limit || 10)
      .exec();

    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getNextPostAfter = async (req, res) => {
  try {
    const { _doc: result } = await Post.findOne().sort('-datetime').skip(req.params.offset).exec();

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
    const { _doc: result } = await Post.findOne({ datetime: parseInt(req.params.datetime) }).exec();

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
    const { _doc: result } = await Post.findOne().sort('-datetime').exec();
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
    await Post.updateOne({ datetime: req.params.datetime });
    res.status(200).end();
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deletePost = async (req, res) => {
  try {
    Post.deleteOne({ datetime: req.params.datetime });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getFieldsFromAllPosts = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const results = await Post.find()
      .sort('-datetime')
      .skip(page * (limit || 10) || 0)
      .limit(limit || 10)
      .select(req.body.fields)
      .exec();

    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const countPosts = async (req, res) => {
  try {
    const count = await Post.countDocuments().exec();
    res.json(count);
  } catch (err) {
    res.status(500).send(err);
  }
};
