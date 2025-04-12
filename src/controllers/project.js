const response = require("../../utils/response");
const { createProject, getAllProjects, getProjectById, updateProjectById, deleteProjectById, updateProjectStatusById, getAllProjectsProgress } = require("../services/project");

exports.insertProject = async (req, res) => {
  const result = await createProject(req.body);
  return response.created(res, result);
};

exports.fetchAllProjects = async (req, res) => {
  const result = await getAllProjects(req.query);
  return response.ok(res, result);
};

exports.fetchProjectById = async (req, res) => {
  const result = await getProjectById(req.params.id);
  return response.ok(res, result);
};

exports.modifyProjectById = async (req, res) => {
  const result = await updateProjectById(req.params.id, req.body);
  return response.ok(res, result);
};

exports.removeProject = async (req, res) => {
  const result = await deleteProjectById(req.params.id);
  return response.ok(res, result);
};

exports.updateProjectStatus = async (req, res) => {
  const result = await updateProjectStatusById(req.params.id, req.body);
  return response.ok(res, result);
};

exports.fetchProjectProgress = async (req, res) => {
  const result = await getAllProjectsProgress(req.query);
  return response.ok(res, result);
};
