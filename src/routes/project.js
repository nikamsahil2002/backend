const express = require("express");
const router = express.Router();

const { insertProject, fetchAllProjects, fetchProjectById, modifyProjectById, removeProject } = require("../controllers/project");
const checkAuth = require("../middlewares/checkAuth");
const checkPermission = require("../middlewares/checkPermission");
const { createProjectValidator, updateProjectValidator } = require("../../validators/project");
const { errorWrapper } = require("../../utils/errorWrapper");
const { validationError } = require('../../utils/validationError');

router.post("/", /* checkAuth, checkPermission,*/ createProjectValidator, validationError, errorWrapper(insertProject));
router.get("/", /* checkAuth, checkPermission,*/ errorWrapper(fetchAllProjects));
router.get("/:id", /* checkAuth, checkPermission,*/ errorWrapper(fetchProjectById));
router.put("/:id", /* checkAuth, checkPermission,*/ updateProjectValidator, validationError, errorWrapper(modifyProjectById));
router.delete("/:id", /* checkAuth, checkPermission,*/ errorWrapper(removeProject));

module.exports = router;
