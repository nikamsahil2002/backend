const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const checkPermission = require('../middlewares/checkPermission');
const { errorWrapper } = require("../../utils/errorWrapper");
const { fetchTaskRecurrenceById, fetchTaskRecurrences, addCommentsOnTask, updateTaskStatus } = require("../controllers/taskRecurrence");
const { taskCommentsValidation, validateTaskStatus } = require('../../validators/taskRecurrence');
const { validationError } = require('../../utils/validationError');

router.get('/', checkAuth, checkPermission, errorWrapper(fetchTaskRecurrences));
router.get('/:id', checkAuth, checkPermission, errorWrapper(fetchTaskRecurrenceById));
router.post('/:id/comments', checkAuth, checkPermission, taskCommentsValidation, validationError, errorWrapper(addCommentsOnTask));
router.put('/:id/status', checkAuth, checkPermission, validateTaskStatus, validationError, errorWrapper(updateTaskStatus));

module.exports = router;