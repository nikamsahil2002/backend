const router = require("express").Router();
const { errorWrapper } = require("../../utils/errorWrapper");
const { validateAddUser, validateUpdateUser } = require("../../validators/user");
const { validationError } = require('../../utils/validationError');

const { insertUser, retrieveUser, retrieveUserById, modifyUser, removeUser } = require("../controllers/user");
const checkAuth  = require("../middlewares/checkAuth");
const checkPermission  = require("../middlewares/checkPermission");

router.post("/",  checkAuth, checkPermission,  validateAddUser, validationError, errorWrapper(insertUser));
router.get("/",  checkAuth, checkPermission,  errorWrapper(retrieveUser));
router.get("/:id",  checkAuth, checkPermission,  errorWrapper(retrieveUserById));
router.put("/:id",  checkAuth, checkPermission,  validateUpdateUser, validationError,  errorWrapper(modifyUser));
router.delete("/:id",  checkAuth, checkPermission,  errorWrapper(removeUser));

module.exports = router;
