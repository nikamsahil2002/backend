const db = require('../models/index');

module.exports = async (req, res, next) => {
    let { baseUrl, userData} = req;
    const url = req["route"].path;
    
    const permission = await db.rolePermission.findOne({
        roleId: userData.roleId,
        baseUrl: baseUrl,
        url : url
    });
    if(!permission){
        return res.status(403).send("You don't have permission to do this")
    }
    next();
}