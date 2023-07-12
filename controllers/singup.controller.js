const SignUpService = require("../services/signup.service");

class SignUpController {
  signUpService = new SignUpService();

  createUser = async (req, res) => {
    const { email, password, confirm, nickname, description } = req.body;
    console.log(req.body)
    try {
      const createUserOne = await this.signUpService.createUser({
        email,
        password,
        confirm,
        nickname,
        description,
      });
      res.status(201).json({ data: createUserOne });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

module.exports = SignUpController;
