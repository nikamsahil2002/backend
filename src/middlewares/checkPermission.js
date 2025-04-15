const db = require("../models/index");

module.exports = async (req, res, next) => {
  try {
    const roleId = req.userData.roleId;

    // check in permission collection
    const permission = await db.permission.find({
      baseUrl : req.baseUrl,
      path : req.route.path,
      method : req.method
    });

    if(!permission[0]){
      return res.status(401).json({ message: "Permission Not Found "});
    }
    // check in role permission colletion
    const rolePermission = await db.role_permission.find({
      roleId,
      permissionId: permission[0]._id
    });

    if(!rolePermission[0]){
      return res.status(401).json({ message: "You Don't Have Permission To This."});
    }
    next();
  }
  catch(err) {
    next(err)
  }
};

