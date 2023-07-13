const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const CommentsController = require('../controllers/comments.controller')
const commentsController = new CommentsController();

router.post('/:postId', authMiddleware, commentsController.createComment);
router.get('/:postId', authMiddleware, commentsController.getAllComments);
router.put('/:postId/:commentId', authMiddleware, commentsController.updatedComment);
router.delete('/:postId/:commentId', authMiddleware, commentsController.deleteComment);
module.exports = router;