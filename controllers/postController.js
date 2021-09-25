const Post = require('../models/postModel');
const Converter = require('../classes/converter');

module.exports.getAllPosts = (req, res) => {
  Post.find({}, (err, posts) => res.send(err || posts));
};

module.exports.getPost = (req, res) => {
  if (req.params.id === '0') {
    Post.findOne()
      .sort('-id')
      .exec((err, post) => convertMarkdownAndSend(err, post, res));
  } else {
    Post.findOne({ id: req.params.id }, (err, post) => convertMarkdownAndSend(err, post, res));
  }
};

module.exports.createPost = (req, res) => {
  Post.findOne()
    .sort('-id')
    .exec((err, post) => {
      if (err) res.send(err);
      const newPost = new Post({ id: post.id, ...req.body });
      newPost.save((err, post) => res.send(err || post));
    });
};

module.exports.updatePost = (req, res) => {
  Post.updateOne({ id: req.params.id }, (err, post) => res.send(err || post));
};

module.exports.deletePost = (req, res) => {
  Post.deleteOne({ id: req.params.id }, err =>
    res.send(err || { message: `Post ${req.params.id} successfully deleted` })
  );
};

module.exports.getFieldFromAllPosts = (req, res) => {
  Post.find({}, (err, posts) => res.send(err || posts.map(p => p[req.params.field])));
};

module.exports.countPosts = (req, res) => {
  Post.countDocuments((err, count) => {
    res.json(err || count);
  });
};

function convertMarkdownAndSend(err, post, res) {
  const converter = new Converter();
  if (err) {
    res.send(err);
  } else {
    const finalPost = post;
    finalPost.post = converter.parseMarkdown(post.post);
    res.send(finalPost);
  }
}
