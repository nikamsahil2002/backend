const { ObjectId } = require('mongoose').Types;

const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const commonFunction = require('../../utils/commonFunctions');
const { DataNotFoundError, BadRequestError } = require("../../utils/customError");
const moment = require('moment');

exports.createTask = async (body) => {

  // check if provided assigend to user id and projectId are valid or not
  for(let i=0;i<body.assignedTo.length;i++){
    if(!commonFunction.checkIfRecordExist(db.user, body.assignedTo[0])){
      throw new BadRequestError(`User With Id ${body.assignedTo[0]} Not Found`)
    }
  }
  
  if(!commonFunction.checkIfRecordExist(db.project, body.projectId)){
    throw new BadRequestError(`Project With Id ${body.projectId} Not Found`)
  }

  const task = await db.task.create(body);

  // if start date is today's date then task recurrence will be created 
  if(moment(body.startDate).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')){
    body.taskId = task._id;
    delete recurrence;
    await db.task_recurrence.create(body);
    commonFunction.taskNotification(task._id);  // send task notification
  }   

  if (!task) throw new BadRequestError("Failed to create task");
  return handleSuccess("Task created successfully");
};

exports.getAllTasks = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const search = query.search || "";
  const sortOrder = parseInt(query.sortOrder) || -1;
  const sortField = query.sortField || "updatedAt";
  const assignedTo = query.assignedTo;
  const project = query.project;
  const priority = query.priority;
  const recurrence = query.recurrence;
  const startDate = query.startDate;

  const searchQuery = {
    $and: [
      ...( project ? [ { "project._id" : new ObjectId(project)} ]: [] ),
      ...( assignedTo ? [ { "assignedTo._id" : new ObjectId(assignedTo)} ]: [] ),
      ...( priority ? [ { priority : priority } ]: [] ),
      ...( recurrence ? [ { recurrence : recurrence } ]: [] ),
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

  const taskData = await commonFunction.findAll(db.task, searchQuery, sortObject, skip, limit, projectFields, lookupFields)

  const totalResponses = taskData[0]?.totalResponses || 0;
  const result = taskData[0]?.result || [];


  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    tasks: result,
  };
  return handleSuccess("Tasks fetched successfully", data);
};

exports.getTaskById = async (_id) => {
  const result = await db.task
              .findById(_id)
              .populate("assignedTo", "firstName lastName email")
              .populate("projectId", "title description category")
              .select("title description media projectId priority assignedTo recurrence estimatedTime startDate dueDate completedAt updatedAt")
  if (!result) throw new DataNotFoundError("Task not found");
  return handleSuccess("Task fetched successfully", result);
};

exports.updateTaskById = async (_id, body) => {

  // check if provided assigend to user id and projectId are valid or not
  for(let i=0;i<body?.assignedTo?.length;i++){
    if(!commonFunction.checkIfRecordExist(db.user, body.assignedTo[0])){
      throw new BadRequestError(`User With Id ${body.assignedTo[0]} Not Found`)
    }
  }
  if(body.projectId && !commonFunction.checkIfRecordExist(db.project, body.projectId)){
    throw new BadRequestError(`Project With Id ${body.projectId} Not Found`)
  }
  const result = await db.task.findByIdAndUpdate(_id, body, { new: true });
  if (!result) throw new BadRequestError("Failed to update task");
  return handleSuccess("Task updated successfully");
};

exports.deleteTaskById = async (_id) => {
  const result = await db.task.findByIdAndUpdate(
    _id,
    { deletedAt: new Date() },
    { new: true }
  );
  if (!result) throw new BadRequestError("Failed to delete task");
  return handleSuccess("Task deleted successfully");
};

