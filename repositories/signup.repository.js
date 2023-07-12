const { Users } = require("../models");
const bcrypt = require("bcryptjs");
class SignUpRepository {
  constructor() {
    this.Users = Users;
  }
  createUser = async (email, password, nickname, description) => {
    const hashPassword = await bcrypt.hash(password, 5);
    await this.Users.create({
      email,
      password: hashPassword,
      nickname,
      description,
    });

    return console.log("회원가입 완료");
  };
}

module.exports = SignUpRepository;
