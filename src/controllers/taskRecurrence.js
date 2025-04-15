const response = require("../../utils/response");
const { getAllTasksRecurrences, getTaskRecurrenceById, addComments, updateTaskStatus } = require("../services/taskRecurrence");


exports.fetchTaskRecurrences = async (req, res) => {
  const result = await getAllTasksRecurrences(req.query, req.userData.roleName, req.userData.id);
  return response.ok(res, result);
};

exports.fetchTaskRecurrenceById = async (req, res) => {
  const result = await getTaskRecurrenceById(req.params.id);
  return response.ok(res, result);
};

exports.addCommentsOnTask = async (req, res) => {
  const _id = req.params.id;
  const result = await addComments(_id, req.body);
  return response.ok(res, result);
};

exports.updateTaskStatus = async (req, res) => {
  const _id = req.params.id;
  const result = await updateTaskStatus(_id, req.body);
  return response.ok(res, result);
};