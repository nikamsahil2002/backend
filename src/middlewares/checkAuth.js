const jwt = require('jsonwebtoken');
const db = require('../models/index');
const client = require('../../config/redis');
const response = require('../../utils/response');

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
          
        if (!token) {
            return response.unauthorized(res);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return response.unauthorized(res);
        }

        const redisToken = await client.get(token);
        if (redisToken) {
            const userData = await db.User
            .findById(decoded.id)
            .populate("roleId","roleName")
            .select('id email roleId');

            if (!userData) {
                return response.unauthorized(res);
            }
            req.userData = {
                id: userData._id,
                email: userData.email,
                roleId: userData.roleId,
                roleName: userData.roleId?.roleName

            };
            return next();
        }

        await client.setEx(token, 3600, JSON.stringify(decoded));

        const check = await db.UserToken.findOne({ userId: decoded.id, token });
        if (!check) {
            return response.unauthorized(res);
        }

        const userData = await db.User
            .findById(decoded.id)
            .populate("roleId , roleName")
            .select('id email roleId');
        if (!userData) {
            return response.unauthorized(res);
        }


        req.userData = {
            id: userData._id,
            email: userData.email,
            roleId: userData.roleId,
            roleName: userData.roleId?.roleName
        };
        next();
    } catch (err) {
        next(err);
    }
};
