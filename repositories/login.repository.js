const { Users } = require("../models");
const bcrypt = require("bcryptjs");
class LoginRepository {
  login = async ({ email, password }) => {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      throw new Error("이메일 또는 비밀번호를 확인해주세요.");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("이메일 또는 비밀번호를 확인해주세요.");
    }
    return user;
  };
}

module.exports = LoginRepository;