const db = require('../models');
const bcrypt = require('bcrypt');
const moment = require("moment");
const { Op } = require("sequelize");

const { generateToken } = require('../utils/jwt')
const { UnauthorizedError, BadRequestError, ValidationError } = require('../utils/customError');
// const { sendEmail } = require('../utils/sendMail');

exports.logInService = async (body) => {
    const mobile = body.mobile;
    const getUserInfo = await db.user.findOne({ 
            where: { 
                mobile,
                deleted_at : null
            },
            include: [
                {
                    model: db.role,
                    attributes: ['name']
                },
                {
                    model: db.hotel,
                    attributes: ['name', 'address', 'baseTokenPoints']
                }
            ]
        });

    if (!getUserInfo) {
        throw new ValidationError(`User with Mobile Number ${body.mobile} Not Found.`);
    }
    
    const comparePassword = await bcrypt.compare(body.password, getUserInfo.password);
    if (!comparePassword) {
        throw new UnauthorizedError("Invalid Mobile Number or Password.");
    }
    const data = {
        id: getUserInfo.id,
        mobile: mobile,
        role : getUserInfo.role?.name,
        hotel: getUserInfo.hotel?.name
    }
    const accessToken = generateToken(data);
    const ifTokenExist = await db.user_token.findOne({ where: { user_id: getUserInfo.id }});
    if(ifTokenExist){
        await db.user_token.update(
            { token: accessToken },
            { where: { 
                user_id: getUserInfo.id 
            }
        });
    }
    else{
        await db.user_token.create({ 
            userId: getUserInfo.id, 
            token: accessToken 
        });
    }
    return {
        status : 200,
        message : "Logged In successfully",
        role : getUserInfo.role?.name,
        hotel: getUserInfo.hotel,
        token : accessToken
    }
}

exports.logoutService = async (mobile, accesstoken) => {
    if(!mobile || !accesstoken){
        throw new ValidationError();
    }
    const userInfo = await db.user.findOne({
        where: {
            mobile,
            deleted_at : null
        }
    });
    if(!userInfo){
        throw new ValidationError(`User with Mobile Number ${mobile} does not exist`);
    }
    await db.user_token.update(
        { deletedAt: Date.now() },
        {
            where: {
                userId : userInfo.id,
                token : accesstoken
            }
        }
    );
    return {
        status: 200,
        message : "User Logged Out Successfully."
    }
}


// exports.forgotPasswordService = async (forgotPasswordData) => {
//     const { email } = forgotPasswordData;
//     const userInfo = await retriveUserInfo(email); 
    
//     const otp = Math.floor(1000 + Math.random() * 9000);

//     const templateForMail = await db.emailTemplate.findOne({
//         where: {
//             event: "verify-otp"
//         },
//         individualHooks: true
//     });
//     if(!templateForMail){
//         throw new BadRequestError("Error While sending mail");
//     }
//     templateForMail.interpolateContent(userInfo.name, otp);

//     const insertOtp = await db.userOtp.create({
//             userId: userInfo.id,
//             otp
//         }
//     );
//     if (!insertOtp) {
//         throw new BadRequestError("error while sending otp");
//     }

//     await sendEmail(
//         userInfo.email,
//         templateForMail.subjectLine,
//         templateForMail.content
//     );

//     return { 
//         status : 200, 
//         message: "Otp sent successfully" 
//     };
// };

  
// exports.verifyOtpService = async (verifyOtpData) => {
//     const { email, otp } = verifyOtpData;
//     const userInfo = await retriveUserInfo(email);

//     const verifyOtp = await db.userOtp.findOne({
//       where: { 
//             userId: userInfo.id, 
//             otp, 
//             expiryTime: { 
//                 [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss")
//             } 
//         },
//         order: [["createdAt", "DESC"]],
//     });
//     if(!verifyOtp) {
//         throw new ValidationError("OTP is invalid or expired!");
//     } 
//     else if(verifyOtp.isVerified) { // check if the otp is already verified.
//       throw new ValidationError("OTP is already verified!")
//     }
//     const modifyOtpStatus = await db.userOtp.update(
//       { isVerified: true },
//       {
//         where: {
//           id: verifyOtp.id,
//         },
//       }
//     );
//     if(!modifyOtpStatus[0]) {
//         throw new BadRequestError('Error while verifying OTP!');
//     }
//     return { 
//         status : 200, 
//         message: "Otp verified successfully"
//     };
// };

async function retriveUserInfo(mobile){
    const userExist = await db.user.findOne({ 
        where: { 
            mobile: mobile
        } 
    });
    if (!userExist) {
        throw new ValidationError(`User with Mobile Number ${mobile} not found`);
    }
    return userExist;
}

  
exports.resetPasswordService = async (resetPasswordData) => {
    const { mobile, newPassword, otp } = resetPasswordData;
    const userInfo = await retriveUserInfo(mobile);

    const verifyOtp = await db.userOtp.findOne({
        where: { 
            user_id: userInfo.id, 
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