const router = require("express").Router();

const { errorWrapper } = require('../../utils/errorWrapper');
const { validateUpdatePassword, validateVerifyOtp } = require('../../validators/user');
const { validationError } = require('../../utils/validationError');
const { login, logout, forgotPassword, verifyOtp, resetPassword } = require('../controllers/auth');

router.post('/log-in', errorWrapper(login));
router.post('/log-out', errorWrapper(logout));
router.post('/forgot-password', errorWrapper(forgotPassword)); // step1
router.post('/verify-otp', validateVerifyOtp, validationError, errorWrapper(verifyOtp)); // step2
router.post('/reset-password', validateUpdatePassword, validationError, errorWrapper(resetPassword)); // step3

module.exports = router;
