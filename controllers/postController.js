import Post from '../models/postModel';
import Converter from '../classes/converter';

export const getAllPosts = (req, res) => {
  Post.find({}, (err, posts) => res.send(err || posts));
};

export const getPost = (req, res) => {
  if (req.params.id === '0') {
    Post.findOne()
      .sort('-id')
      .exec((err, post) => convertMarkdownAndSend(err, post, res));
  } else {
    Post.findOne({ id: req.params.id }, (err, post) => convertMarkdownAndSend(err, post, res));
  }
};

export const createPost = (req, res) => {
  Post.findOne()
    .sort('-id')
    .exec((err, post) => {
      if (err) res.send(err);
      const newPost = new Post({ id: post.id, ...req.body });
      newPost.save((err, post) => res.send(err || post));
    });
};

export const updatePost = (req, res) => {
  Post.updateOne({ id: req.params.id }, (err, post) => res.send(err || post));
};

export const deletePost = (req, res) => {
  Post.deleteOne({ id: req.params.id }, err =>
    res.send(err || { message: `Post ${req.params.id} successfully deleted` })
  );
};

export const getFieldFromAllPosts = (req, res) => {
  Post.find({}, (err, posts) => res.send(err || posts.map(p => p[req.params.field])));
};

export const countPosts = (req, res) => {
  Post.countDocuments((err, count) => {
    res.json(err || count);
  });
};

const convertMarkdownAndSend = (err, post, res) => {
  const converter = new Converter();
  if (err) {
    res.send(err);
  } else {
    const finalPost = post;
    finalPost.post = converter.parseMarkdown(post.post);
    res.send(finalPost);
  }
};
