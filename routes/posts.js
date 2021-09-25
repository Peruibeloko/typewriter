const router = require('express').Router();

const post = require('../controllers/postController');

router.get('/', post.getAllPosts);
router.post('/', post.createPost);

router.get('/field/:field', post.getFieldFromAllPosts);

router.get('/count', post.countPosts);

router.get('/:id', post.getPost);
router.patch('/:id', post.updatePost);
router.delete('/:id', post.deletePost);

module.exports = router;
