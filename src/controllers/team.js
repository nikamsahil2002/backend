const response = require("../../utils/response");
const { createTeam, getAllTeam, getTeamById, updateTeamById, deleteTeamById } = require("../services/team");


exports.insertTeam = async (req, res) => {
  const result = await createTeam(req.body);
  return response.created(res, result);
};

exports.fetchTeam = async (req, res) => {
  const result = await getAllTeam(req.query);
  return response.ok(res, result);
};

exports.fetchTeamById = async (req, res) => {
  const result = await getTeamById(req.params.id);
  return response.ok(res, result);
};

exports.modifyTeam = async (req, res) => {
  const result = await updateTeamById(req.params.id, req.body);
  return response.ok(res, result);
};

exports.removeTeam = async (req, res) => {
  const result = await deleteTeamById(req.params.id);
  return response.ok(res, result);
};

