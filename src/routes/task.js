const express = require("express");
const router = express.Router();
const checkAuth = require("../middleWare/checkAuth");
const { checkPermission } = require('../middleWare/checkPermission');
const { errorWrapper } = require("../../utils/errorWrapper");
const { insertTask, fetchTaskById, fetchTasks, modifyTask, removeTask } = require("../controllers/task");
const { createTaskValidator, updateTaskValidator } = require("../../validators/task");

router.post('/', checkAuth, checkPermission, createTaskValidator, errorWrapper(insertTask));
router.get('/', checkAuth, checkPermission, errorWrapper(fetchTasks));
router.get('/:id', checkAuth, checkPermission, errorWrapper(fetchTaskById));
router.put('/:id', checkAuth, checkPermission, updateTaskValidator, errorWrapper(modifyTask));
router.delete('/:id', checkAuth, checkPermission, errorWrapper(removeTask));

module.exports = router;