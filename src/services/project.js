const { BadRequestError, DataNotFoundError } = require("../../utils/customError");
const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const commonFunction = require('../../utils/commonFunctions');

exports.createProject = async (body) => {
  const result = await db.project.create(body);
  if (!result) {
    throw new BadRequestError("Error creating project");
  }
  return handleSuccess("Project created successfully");
};

exports.getAllProjects = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const search = query.search || "";
  const sortOrder = parseInt(query.sortOrder) || -1;
  const sortField = query.sortField || "updatedAt";

  const searchQuery = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ]
  };
  const projectFields = {
    name: 1,
    description: 1,
    createdAt: 1
  };

  const sortObject = {};
  sortObject[sortField] = sortOrder;

  const projectData = await commonFunction.findAll(db.project, searchQuery, sortObject, skip, limit, projectFields, []);

  const totalResponses = projectData[0]?.totalResponses || 0;
  const result = projectData[0]?.result || [];

  if (result.length === 0) {
    throw new DataNotFoundError(`Data not found`);
  }

  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    responses: result,
  };
  return handleSuccess("All projects fetched successfully", data);
};

exports.getProjectById = async (_id) => {
  const result = await db.project.findOne({ _id });
  if (!result) {
    throw new DataNotFoundError("Project not found");
  }
  return handleSuccess("Project fetched successfully", result);
};

exports.updateProjectById = async (_id, body) => {
  const updateObject = {};

  if (body.name) updateObject.name = body.name;
  if (body.description) updateObject.description = body.description;

  const updateProject = await db.project.findOneAndUpdate(
    { _id },
    updateObject,
    { new: true }
  );

  if (!updateProject) {
    throw new DataNotFoundError("Project not found");
  }
  return handleSuccess("Project updated successfully");
};

exports.deleteProjectById = async (_id) => {
  const removeProject = await db.project.findOneAndUpdate(
    { _id },
    { deletedAt: new Date() }
  );
  if (!removeProject) {
    throw new BadRequestError("Error deleting project");
  }
  return handleSuccess("Project deleted successfully");
};
