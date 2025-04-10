const db = require("../models/index");

module.exports = async (req, res, next) => {
  let match = false;
  const roleId = req.userData.roleId;

  const checkRole = await db.Role
    .findOne({ _id: roleId })
    .populate("permissions");


  if (!checkRole) {
      return res.status(401).send({ message: "Role Not Found " });
  }

  checkRole.permissions.forEach((e) => {
    if (
      e.method === req.method &&
      e.path === req.route.path &&
      e.baseUrl === req.baseUrl
    ) {
      match = true;
    }
  });
  if (!match) {
    return res.status(403).json({ error: true, message: "You don't have permission for this!" });
  }
  next();

};

