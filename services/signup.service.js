const SignUpRepository = require("../repositories/signup.repository");
const { Users } = require("../models");

class SignUpService {
  signUpRepository = new SignUpRepository();
  createUser = async ({ email, password, confirm, nickname, description }) => {
    const emailReg =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const passwordReg = /^.{4,}$/; //password 형식 검사

    try {
      if (!emailReg.test(email)) {
        throw new Error("이메일 형식이 일치하지 않습니다.");
      }
      if (password !== confirm) {
        throw new Error("패스워드가 일치하지 않습니다.");
      }
      if (!passwordReg.test(password)) {
        throw new Error("비밀번호 형식이 일치하지 않습니다.");
      }
      if (!nickname) {
        throw new Error("닉네임 형식이 일치하지 않습니다.");
      }

      const isExistUser = await Users.findOne({ where: { email } });

      if (isExistUser) {
        throw new Error("중복된 이메일입니다.");
      }

      await this.signUpRepository.createUser(
        email,
        password,
        nickname,
        description
      );
    } catch (err) {
      console.log(err)
    }
  };
}

module.exports = SignUpService;
