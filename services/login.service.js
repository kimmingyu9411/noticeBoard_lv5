const jwt = require("jsonwebtoken");

const LoginRepository = require("../repositories/login.repository");

class LoginService {
  loginRepository = new LoginRepository();

  login = async ({ email, password }) => {
    try {
      const user = await this.loginRepository.login({ email, password });
      const token = jwt.sign({ userId: user.userId }, "custom-secret-key");
      return token;
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = LoginService;
