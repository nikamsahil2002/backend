const { ObjectId } = require('mongoose').Types;

const { BadRequestError, DataNotFoundError } = require("../../utils/customError");
const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const commonFunction = require('../../utils/commonFunctions');


exports.createProject = async (body) => {
  // first check provided team and category are valid or not
  if(commonFunction.checkIfRecordExist(db.team, body.assignedTo)){
    throw new BadRequestError(`Team With Id ${body.assignedTo} Not Found`)
  }
  if(commonFunction.checkIfRecordExist(db.category, body.category)){
    throw new BadRequestError(`Category With Id ${body.category} Not Found`)
  }

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
  const category = query.category;
  const assignedTo = query.assignedTo;
  const status = query.status;
  const startDate = query.startDate;

  const searchQuery = {  // optional filter integrated in get api for category, assigned to team, status, start date and search
    $and: [
      ...( category ? [ { "category._id" : new ObjectId(category)} ]: [] ),
      ...( assignedTo ? [ { "assignedTo._id" : new ObjectId(category)} ]: [] ),
      ...( status ? [ { status : status} ]: [] ),
      ...( startDate ? [ { startDate : { $gte: moment(startDate).format("YYYY-MM-DD HH:mm:ss") } } ]: [] ),
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { "category.name": { $regex: search, $options: "i" } },
        ]
      }
    ]
  };
  const projectFields = {
    title: 1,
    description: 1,
    "category.name": 1,
    "category.description": 1,
    "assignedTo.name": 1,
    "assignedTo.lead": 1,
    "assignedTo.members": 1,
    "projectLead.firstName": 1,
    "projectLead.lastName": 1,
    "projectLead.email": 1,
    status: 1,
    estimatedTime: 1,
    startDate: 1,
    dueDate: 1,
    completedAt: 1,
    updatedAt: 1,
  };

  const lookupFields = [
    {
      $lookup : {
        from : 'categories',
        localField : 'category',
        foreignField : '_id',
        as : 'category'
      }
    },
    {
        $lookup : {
          from : 'teams',
          localField : 'assignedTo',
          foreignField : '_id',
          as : 'assignedTo'
        }
    },
    {
      $lookup : {
        from : 'users',
        localField : 'assignedTo.lead',
        foreignField : '_id',
        as : 'projectLead'
      }
    },
    { $unwind : "$category" },
    { $unwind : "$assignedTo" },
    { $unwind : "$projectLead" },

  ]

  const sortObject = {};
  sortObject[sortField] = sortOrder;

  const projectData = await commonFunction.findAll(db.project, searchQuery, sortObject, skip, limit, projectFields, lookupFields);

  const totalResponses = projectData[0]?.totalResponses || 0;
  const result = projectData[0]?.result || [];

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
  const result = await db.project
          .findOne({ _id })
          .populate("category", "name description")
          .populate("assignedTo", "name lead members")
          .select("title description category assignedTo status estimatedTime startDate dueDate completedAt")
  if (!result) {
    throw new DataNotFoundError("Project not found");
  }
  return handleSuccess("Project fetched successfully", result);
};

exports.updateProjectById = async (_id, body) => {
  // first check provided team and category are valid or not
  if(body.assignedTo && commonFunction.checkIfRecordExist(db.team, body.assignedTo)){
    throw new BadRequestError(`Team With Id ${body.assignedTo} Not Found`)
  }
  if(body.category && commonFunction.checkIfRecordExist(db.category, body.category)){
    throw new BadRequestError(`Category With Id ${body.category} Not Found`)
  }

  const updateProject = await db.project.findOneAndUpdate(
    { _id },
    body,
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
