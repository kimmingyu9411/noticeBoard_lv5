const express = require('express');
const router = express.Router();

const SignUpController = require('../controllers/singup.controller.js');
const signUpController = new SignUpController();

router.post('/', signUpController.createUser);

module.exports = router