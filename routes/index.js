const express = require('express');
const router = express.Router();
const postsRouter = require('./posts.route.js');
const signupRouter = require('./signup.route.js');
const loginRouter = require('./login.route.js');
const commentsRouter = require('./comments.route.js');

router.use('/posts', postsRouter);
router.use('/signup', signupRouter);
router.use('/login', loginRouter);
router.use('/comments', commentsRouter);

module.exports = router;
