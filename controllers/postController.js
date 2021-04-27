const Post = require('../models/postModel');

module.exports.getAllPosts = (req, res) => {
  Post.find({}, (err, posts) => res.send(err || posts));
};

module.exports.getPost = (req, res) => {
  Post.findOne(
    {
      id: req.params.id
    },
    (err, post) => res.send(err || post)
  );
};

module.exports.createPost = (req, res) => {
  const newPost = new Post(req.body);
  newPost.save((err, post) => res.send(err || post));
};

module.exports.updatePost = (req, res) => {
  Post.updateOne(
    {
      id: req.params.id
    },
    (err, post) => res.send(err || post)
  );
};

module.exports.deletePost = (req, res) => {
  Post.deleteOne(
    {
      id: req.params.id
    },
    err => res.send(err || { message: `Post ${req.params.id} successfully deleted` })
  );
};

module.exports.getFieldFromAllPosts = (req, res) => {
  Post.find({}, (err, posts) => res.send(err || posts.map(p => p[req.params.field])));
};
