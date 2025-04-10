const { createUser, fetchUserDetails, fetchUserById, updateUserById, deleteUserById } = require("../services/user");
  const response = require("../../utiles/response");
  
exports.insertUser = async (req, res) => {
    console.log(req.body)
    const result = await createUser(req.body);
    return response.created(res, result);
};

exports.retrieveUser = async (req, res) => {
    const result = await fetchUserDetails(req.query);
    return response.ok(res, result);
};

exports.retrieveUserById = async (req, res) => {
    const { id } = req.params;
    const result = await fetchUserById(id);
    return response.ok(res, result);
};

exports.modifyUser = async (req, res) => {
    const { id } = req.params;
    const result = await updateUserById(id, req.body);
    return response.ok(res, result);
};

exports.removeUser = async (req, res) => {
    const { id } = req.params;
    const result = await deleteUserById(id);
    return response.ok(res, result);
};
  