const LoginService = require('../services/login.service')

class LoginController {

    loginService = new LoginService();

    login = async (req, res) => {
        const { email, password } = req.body;
        try{
            const token = await this.loginService.login({email, password})
            
            res.cookie("Authorization", `Bearer ${token}`);
            res.status(200).json({data: token})
        }
        catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}

module.exports = LoginController