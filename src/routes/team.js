const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const checkPermission = require('../middlewares/checkPermission');
const { errorWrapper } = require("../../utils/errorWrapper");
const { insertTeam, fetchTeam, fetchTeamById, modifyTeam, removeTeam } = require("../controllers/team");
const { createTeamValidator, updateTeamValidator } = require("../../validators/team");
const { validationError } = require('../../utils/validationError');

router.post('/',/* checkAuth, checkPermission,*/ createTeamValidator, validationError, errorWrapper(insertTeam));
router.get('/', /*checkAuth, checkPermission,*/ errorWrapper(fetchTeam));
router.get('/:id',/* checkAuth, checkPermission,*/ errorWrapper(fetchTeamById));
router.put('/:id',/* checkAuth, checkPermission,*/ updateTeamValidator, validationError, errorWrapper(modifyTeam));
router.delete('/:id',/* checkAuth, checkPermission,*/ errorWrapper(removeTeam));

module.exports = router;