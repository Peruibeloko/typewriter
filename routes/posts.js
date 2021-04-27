const router = require('express').Router();

const post = require('../controllers/postController');

router.route('/').get(post.getAllPosts).post(post.createPost);

router.route('/:id').get(post.getPost).patch(post.updatePost).delete(post.deletePost);

router.route('/field/:field').get(post.getFieldFromAllPosts);

router.route('/count').get(post.countPosts);

module.exports = router;
