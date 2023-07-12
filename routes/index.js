const express = require("express");
const router = express.Router();
const signupRouter = require("./signup.route.js");
const loginRouter = require("./login.route.js");

router.use("/signup", signupRouter);
router.use("/login", loginRouter);

module.exports = router;
