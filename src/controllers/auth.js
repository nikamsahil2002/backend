const { logInService, logoutService, forgotPasswordService, verifyOtpService, resetPasswordService } = require('../services/auth');

exports.login = async (req, res) => {
    const body = req.body;
    const result = await logInService(body);
    res.status(200).send(result);
}

exports.logout = async (req, res) => {
    const { mobile } = req.body;
    const accesstoken = req.headers.authorization.split(' ')[1];
    const result = await logoutService(mobile, accesstoken);
    res.status(200).send(result);
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const forgotPasswordData = { email };
    const result = await forgotPasswordService(forgotPasswordData);
    res.status(200).send(result);
};
  
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const verifyOtpData = { email, otp };
    const result = await verifyOtpService(verifyOtpData);
    res.status(200).send(result);
};
  
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const resetPasswordData = { email, newPassword, otp };
    const result = await resetPasswordService(resetPasswordData);
    res.status(200).send(result);
};
