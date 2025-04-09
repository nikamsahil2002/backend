const jwt = require('jsonwebtoken');

const db = require('../models/index')
const client = require('../config/redis');
const response = require('../utils/response');



module.exports = async (req, res, next)=> {
    try {
        let token = req.headers.authorization;
        if(!token){
            return response.unauthorized(res);
        }
        token = token.split(' ')[1];
        //if token is present in the database now decode the token
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if(!decoded.userid){
            return response.unauthorized(res);
        }

        // first check if the token is present in redis cache
        const redisToken = await client.get(token);
        const decode = jwt.verify(token, process.env.PRIVATE_KEY);

        if (redisToken) {
            console.log("JWT Token found in Redis");
            if (decode) { 
                let userData = await db.user.findOne({
                    _id : decoded.userid
                });
                userData = userData[0];
                if(!userData){
                    return response.noData(res);
                };
                req.userData = {id : userData.id, email : userData.email, roleId : userData.roleId };
                return next();
            } 
            else {
              console.log("Invalid token in Redis");
              return response.unauthorized(res);
            }
        }

        // set the token into the redis
        await client.setEx(token, 3600, JSON.stringify(decode));
        console.log("setted redis token");

        // check if the userid and token is present in the database or not.\
        const check = await db.userToken.findOne({
            userId: decoded.userid,
            token: token
        });
        if (!check) {
            return response.unauthorized(res);
        }
        // find the userdata and add that into request object for further use
        const userData =await db.user.findOne(
            { _id : decoded.userid },
            )
            .select('id email roleId');
        if(!userData){
            return response.noData(res);
        };
        req.userData = {id : userData._id, email : userData.email, roleId : userData.roleId };
        next();
    }
    catch(err){
        next(err);
    }
}