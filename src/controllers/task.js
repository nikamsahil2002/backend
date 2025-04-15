const response = require("../../utils/response");
const { createTask, getAllTasks, getTaskById, updateTaskById, deleteTaskById, completeTask } = require("../services/task");


exports.insertTask = async (req, res) => {
  const result = await createTask(req.body, req.userData.id);
  return response.created(res, result);
};

exports.fetchTasks = async (req, res) => {
  const result = await getAllTasks(req.query, req.userData.roleName, req.userData.id);
  return response.ok(res, result);
};

exports.fetchTaskById = async (req, res) => {
  const result = await getTaskById(req.params.id);
  return response.ok(res, result);
};

exports.modifyTask = async (req, res) => {
  const result = await updateTaskById(req.params.id, req.body);
  return response.ok(res, result);
};

exports.removeTask = async (req, res) => {
  const result = await deleteTaskById(req.params.id);
  return response.ok(res, result);
};

exports.submitTask=async(req,res)=>{
  const result=await completeTask(req.query,req.body,req.user.id);
  return response.ok(res,result)
}
