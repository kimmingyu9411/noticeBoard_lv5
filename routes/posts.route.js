const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/', authMiddleware, postsController.createPost);
router.get('/like', authMiddleware, postsController.getLikePosts)
router.get('/', postsController.getPosts);
router.get('/:postId', authMiddleware, postsController.getPostsDetail);
router.put('/:postId', authMiddleware, postsController.updatedPost);
router.delete('/:postId', authMiddleware, postsController.deletePost);
router.put('/:postId/like', authMiddleware, postsController.likePost)
module.exports = router;