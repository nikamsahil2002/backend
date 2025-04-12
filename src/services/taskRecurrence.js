const { ObjectId } = require('mongoose').Types;

const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const commonFunction = require('../../utils/commonFunctions');
const { DataNotFoundError, BadRequestError } = require("../../utils/customError");
const moment = require('moment');


exports.getAllTasksRecurrences = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const search = query.search || "";
  const sortOrder = parseInt(query.sortOrder) || -1;
  const sortField = query.sortField || "updatedAt";
  const assignedTo = query.assignedTo;
  const project = query.project;
  const priority = query.priority;
  const status = query.status;
  const startDate = query.startDate;

  const searchQuery = {
    $and: [
      ...( project ? [ { "project._id" : new ObjectId(project)} ]: [] ),
      ...( assignedTo ? [ { "assignedTo._id" : new ObjectId(assignedTo)} ]: [] ),
      ...( priority ? [ { priority : priority } ]: [] ),
      ...( status ? [ { status : status } ]: [] ),
      ...( startDate ? [ { startDate : { $gte: moment(startDate).format("YYYY-MM-DD HH:mm:ss") } } ]: [] ),
      {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    ],
  };

  const projectFields = {
    title: 1,
    description: 1,
    "project.title": 1,
    "project.description": 1,
    media: 1,
    priority: 1,
    "assignedTo.firstName": 1,
    "assignedTo.lastName": 1,
    recurrence: 1,
    startDate: 1,
    status: 1,
    comments: 1,
    estimatedTime: 1,
    dueDate: 1,
    completedAt: 1,
    updatedAt: 1,
  };

  const lookupFields = [
    {
      $lookup : {
        from : 'projects',
        localField : 'projectId',
        foreignField : '_id',
        as : 'project'
      }
    },
    {
        $lookup : {
          from : 'users',
          localField : 'assignedTo',
          foreignField : '_id',
          as : 'assignedTo'
        }
    },
    { $unwind : "$project" },
  ]

  const sortObject = {};
  sortObject[sortField] = sortOrder;

  const taskData = await commonFunction.findAll(db.task_recurrence, searchQuery, sortObject, skip, limit, projectFields, lookupFields)

  const totalResponses = taskData[0]?.totalResponses || 0;
  const result = taskData[0]?.result || [];


  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    tasks: result,
  };
  return handleSuccess("Tasks Recurrence fetched successfully", data);
};

exports.getTaskRecurrenceById = async (_id) => {
  const result = await db.task_recurrence
              .findById(_id)
              .populate("assignedTo", "firstName lastName email")
              .populate("projectId", "title description category")
              .select("title description media projectId taskId priority assignedTo status estimatedTime startDate dueDate completedAt comments updatedAt")

  if (!result){
    throw new DataNotFoundError("Task Recurrence not found");
  }

  return handleSuccess("Task Recurrence fetched successfully", result);
};

exports.addComments = async (_id, body) => {
  const addComments = await db.task_recurrence.findByIdAndUpdate(_id,
    { $push: { comments: body } }
  )

  if (!addComments){
    throw new DataNotFoundError(`Task with ID ${_id} Not Found`);
  }

  return handleSuccess("Task Comment Added Successfully");
};

exports.updateTaskStatus = async (_id, body) => {
  const addComments = await db.task_recurrence.findByIdAndUpdate(_id,
    body
  )

  if (!addComments){
    throw new DataNotFoundError(`Task with ID ${_id} Not Found`);
  }

  return handleSuccess("Task Status Updated Successfully");
};


