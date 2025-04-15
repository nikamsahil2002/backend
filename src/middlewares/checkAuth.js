const jwt = require('jsonwebtoken');
const db = require('../models/index');
// const client = require('../../config/redis');
const response = require('../../utils/response');

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];
          
        if (!token) {
            return response.unauthorized(res);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return response.unauthorized(res);
        }

        // const redisToken = await client.get(token); // removing redis functionality as it is not working in redirect free host
        // if (redisToken) {
        //     const userData = await db.user
        //         .findById(decoded.id)
        //         .populate("roleId","roleName")
        //         .select('id email roleId');

        //     if (!userData) {
        //         return response.unauthorized(res);
        //     }
        //     req.userData = {
        //         id: userData._id,
        //         email: userData.email,
        //         roleId: userData.roleId._id,
        //         roleName: userData.roleId?.roleName
        //     };
        //     return next();
        // }

        // await client.setEx(token, 3600, JSON.stringify(decoded));

        const check = await db.user_token.find({ userId: decoded.id, token });
        if (!check) {
            return response.unauthorized(res);
        }
        const userData = await db.user
            .findById(decoded.id)
            .populate("roleId" , "roleName")
            .select('id email roleId');
        if (!userData) {
            return response.unauthorized(res);
        }
        req.userData = {
            id: userData._id,
            email: userData.email,
            roleId: userData.roleId?._id,
            roleName: userData.roleId?.roleName
        };
        next();
    } 
    catch (err) {
        next(err);
    }
};
