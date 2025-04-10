const { logInService, logoutService, forgotPasswordService, verifyOtpService, resetPasswordService } = require('../services/auth');
const response = require('../../utiles/response');


exports.login = async (req, res) => {
    const body = req.body;
    const result = await logInService(body);
    return response.ok(res,result);
}

exports.logout = async (req, res) => {
    const { mobile } = req.body;
    const accesstoken = req.headers.authorization.split(' ')[1];
    const result = await logoutService(mobile, accesstoken);
    return response.ok(res,result);
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const forgotPasswordData = { email };
    const result = await forgotPasswordService(forgotPasswordData);
    return response.ok(res,result);
};
  
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const verifyOtpData = { email, otp };
    const result = await verifyOtpService(verifyOtpData);
    return response.ok(res,result);
};
  
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const resetPasswordData = { email, newPassword, otp };
    const result = await resetPasswordService(resetPasswordData);
    return response.ok(res,result);
};
