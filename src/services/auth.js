const db = require('../models');
const moment = require("moment");
const client = require('../../config/redis');
const sendEmail = require('../../utils/email')
const { generateToken } = require('../../utils/jwt')
const { UnauthorizedError, BadRequestError, ValidationError, DataNotFoundError } = require('../../utils/customError');

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

    const token = generateToken(userExists);

    const userToken = await db.user_token.findOne({ userId: userExists._id });

    if (userToken) {
        await db.user_token.updateOne(
            { userId: userExists._id },
            { token: token }
        );
    }     
    else {
        await db.UserToken.create({
            userId: userExists._id,
            token: token
        });
    }

    return {
        error: false,
        message: 'Logged In Successfully',
        data: token
    };
}

exports.logoutService = async (body) => {
    const { id, token } = body;

    const deleteUser = await db.user_token.deleteOne({ userId: id });

    await client.del(token);

    if (!deleteUser.deletedCount) {
        return {
            error: false,
            message: 'User Already Logged Out'
        };
    }

    return {
        error: false,
        message: 'User Logged Out Successfully'
    };
}


exports.forgotPasswordService = async (forgotPasswordData) => {
    const { email } = forgotPasswordData;
    const userInfo = await retriveUserInfo(email); 
    
    const otp = Math.floor(1000 + Math.random() * 9000);

    const templateForMail = await db.email_template.findOne({
        where: {
            event: "verify-otp"
        }
    });
    if(!templateForMail){
        throw new BadRequestError("Error While sending mail");
    }
    templateForMail.interpolateContent(userInfo.name, otp);

    const insertOtp = await db.userOtp.create({
            userId: userInfo.id,
            otp
        }
    );
    if (!insertOtp) {
        throw new BadRequestError("error while sending otp");
    }

    await sendEmail(
        userInfo.email,
        templateForMail.subject,
        templateForMail.body
    );

    return { 
        status : 200, 
        message: "Otp sent successfully" 
    };
};

  
exports.verifyOtpService = async (verifyOtpData) => {
    const { email, otp } = verifyOtpData;
    const userInfo = await retriveUserInfo(email);

    const verifyOtp = await db.userOtp.findOne({
      where: { 
            userId: userInfo.id, 
            otp, 
            expiryTime: { 
                [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss")
            } 
        },
        order: [["createdAt", "DESC"]],
    });
    if(!verifyOtp) {
        throw new ValidationError("OTP is invalid or expired!");
    } 
    else if(verifyOtp.isVerified) { // check if the otp is already verified.
      throw new ValidationError("OTP is already verified!")
    }
    const modifyOtpStatus = await db.userOtp.update(
      { isVerified: true },
      {
        where: {
          id: verifyOtp.id,
        },
      }
    );
    if(!modifyOtpStatus[0]) {
        throw new BadRequestError('Error while verifying OTP!');
    }
    return { 
        status : 200, 
        message: "Otp verified successfully"
    };
};

async function retriveUserInfo(email){
    const userExist = await db.user.findOne({ 
        where: { 
            email
        } 
    });
    if (!userExist) {
        throw new ValidationError(`User with Email ${email} not found`);
    }
    return userExist;
}

  
exports.resetPasswordService = async (resetPasswordData) => {
    const { mobile, newPassword, otp } = resetPasswordData;
    const userInfo = await retriveUserInfo(mobile);

    const verifyOtp = await db.user_otp.findOne({
        where: { 
            userId: userInfo.id, 
            otp, 
            isVerified: true 
        },
        order: [["createdAt", "DESC"]],
    });
    if(!verifyOtp) { // check if OTP is verified
        throw new ValidationError("OTP not verified!");
    } 
    else if(moment().isSameOrAfter(moment(verifyOtp.expiryTime))){ // check if OTP is verified but not expired.
        throw new ValidationError("OTP expired!");
    }

    const modifyPassword = await db.user.update( // update the password
      { password: newPassword },
      {
        where: {
          id: userInfo.id,
        },
        individualHooks: true 
      },
      
    );

    if (!modifyPassword[0]) {
        throw new BadRequestError("error while updating password");
    }

    await db.user_otp.update( // set otp as expired
      { expiryTime: moment() },
      {
        where: {
          id: verifyOtp.id,
        },
      }
    );
    return {
        status: 200,
        message: "Password Updated Successfully.",
    };
};