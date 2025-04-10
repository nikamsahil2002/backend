const db = require('../models');
const moment = require("moment");
const client = require('../../config/redis');
const sendEmail = require('../../utiles/email')
const { generateToken } = require('../../utiles/jwt')
const { BadRequestError, ValidationError, DataNotFoundError } = require('../../utiles/customError');
const handleSuccess = require('../../utiles/successHandler');

exports.logInService = async (body) => {
    const { email, password } = body;

    if (!email || !password) {
        throw new BadRequestError('Please enter email and password');
    }

    const userExists = await retriveUserInfo(email); 
    if (!userExists) {
        throw new DataNotFoundError('Email not found');
    }

    const isMatch = await userExists.comparePassword(password);

    if (!isMatch) {
        throw new ValidationError('Invalid Email or Password');
    }
    const payload = {
        id: userExists.id,
        email: userExists.email,
        role : userExists.roleId?.rolrName
    }
    const token = generateToken(payload);
    const userToken = await db.user_token.findOne({ userId: userExists._id });

    if (userToken) {
        await db.user_token.updateOne(
            { userId: userExists._id },
            { token: token }
        );
    }     
    else {
        await db.user_token.create({
            userId: userExists._id,
            token: token
        });
    }
    const data = {
        token
    }
    return handleSuccess('Logged In Successfully', data);
}

exports.logoutService = async (userId, token) => {
    await db.user_token.findOneAndUpdate(
        { userId },
        { deletedAt: Date.now() }
    );
    
    await client.del(token);

    return handleSuccess('Logged Out Successfully');
}


exports.forgotPasswordService = async (email) => {
    const userInfo = await retriveUserInfo(email); 
    
    const otp = Math.floor(1000 + Math.random() * 9000);

    const templateForMail = await db.email_template.find({ name: "verify-otp" });

    if(!templateForMail){
        throw new BadRequestError("Error While sending mail");
    }

    const insertOtp = await db.user_otp.create({
            userId: userInfo._id,
            otp
        }
    );
    if (!insertOtp) {
        throw new BadRequestError("error while sending otp");
    }

    await sendEmail(
        userInfo.email,
        templateForMail[0].subject,
        templateForMail[0]?.body?.replace("{{otp}}", otp)
    );

    return handleSuccess('Otp sent successfully');
};

  
exports.verifyOtpService = async (verifyOtpData) => {
    const { email, otp } = verifyOtpData;
    const userInfo = await retriveUserInfo(email);
    const verifyOtp = await db.user_otp
        .find({
            userId: userInfo._id, 
            otp, 
            expiryTime: { 
                $gte: moment().format("YYYY-MM-DD HH:mm:ss")
            },
        })
        .sort({ createdAt: -1} )

    if(verifyOtp.length == 0) {
        throw new ValidationError("OTP is invalid or expired!");
    } 
    else if(verifyOtp[0].isVerified) { // check if the otp is already verified.
      throw new ValidationError("OTP is already verified!")
    }
    const modifyOtpStatus = await db.user_otp.findByIdAndUpdate( verifyOtp[0]._id,
      { isVerified: true }
    );
    
    if(!modifyOtpStatus) {
        throw new BadRequestError('Error while verifying OTP!');
    }
    return handleSuccess("Otp verified successfully");
};

  
exports.resetPasswordService = async (resetPasswordData) => {
    const { email, newPassword, otp } = resetPasswordData;
    const userInfo = await retriveUserInfo(email);

    const verifyOtp = await db.user_otp.find({
        userId: userInfo._id, 
        otp, 
        isVerified: true 
    });
    if(!verifyOtp[0]) { // check if OTP is verified
        throw new ValidationError("OTP not verified!");
    } 
    else if(moment().isSameOrAfter(moment(verifyOtp[0].expiryTime))){ // check if OTP is verified but not expired.
        throw new ValidationError("OTP expired!");
    }

    const modifyPassword = await db.user.findByIdAndUpdate( // update the password
        { _id: userInfo._id },
        { password: newPassword }
    );

    if (!modifyPassword) {
        throw new BadRequestError("error while updating password");
    }

    await db.user_otp.findByIdAndUpdate( // set otp as expired
        { _id : verifyOtp[0]._id },
        { expiryTime: moment() }
    );
    return handleSuccess("Password Updated Successfully.",);
};

async function retriveUserInfo(email){
    const userExist = await db.user
        .find({ email })
        .populate("roleId")

    if (userExist.length == 0 ) {
        throw new ValidationError(`User with Email ${email} not found`);
    }
    return userExist[0];
}