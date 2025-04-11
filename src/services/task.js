const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const { ObjectId } = require('mongoose').Types;
const {
  DataNotFoundError,
  BadRequestError,
} = require("../../utils/customError");

exports.createTask = async (body) => {
  const task = await db.task.create(body);
  if (!task) throw new BadRequestError("Failed to create task");
  return handleSuccess("Task created successfully");
};

exports.getAllTasks = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const { assignedTo, project, category, status, search = "" } = query;

  const conditions = {};
  if (assignedTo) conditions["assignedTo"] = new ObjectId(assignedTo);
  if (project) conditions["project"] = new ObjectId(project);
  if (category) conditions["category"] = new ObjectId(category);
  if (status) conditions["status"] = status;

  const searchQuery = {
    $and: [
      conditions,
      {
        $or: [
          { "assignedTo.firstName": { $regex: search, $options: "i" } },
          { "assignedTo.lastName": { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    ],
  };

  const tasks = await db.task.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
      },
    },
    {
      $lookup: {
        from: "category",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "project",
        localField: "project",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    {
      $match: { ...searchQuery, deletedAt: null },
    },
    {
      $facet: {
        totalResponses: [{ $count: "count" }],
        result: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              "assignedTo.firstName": 1,
              "assignedTo.lastName": 1,
              "category.name": 1,
              "project.title": 1,
              status: 1,
              priority: 1,
              estimatedTime: 1,
              media: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        totalResponses: { $arrayElemAt: ["$totalResponses.count", 0] },
        result: 1,
      },
    },
  ]);

  const totalResponses = tasks[0]?.totalResponses || 0;
  const result = tasks[0]?.result || [];


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
  const result = await db.task.findById(_id);
  if (!result) throw new DataNotFoundError("Task not found");
  return handleSuccess("Task fetched successfully", result);
};

exports.updateTaskById = async (_id, body) => {
  const result = await db.task.findByIdAndUpdate(_id, body, { new: true });
  if (!result) throw new BadRequestError("Failed to update task");
  return handleSuccess("Task updated successfully", result);
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

exports.completeTask = async (_id) => {
  const result = await db.task.findByIdAndUpdate(
    _id,
    { status: "Completed", completedAt: new Date() },
    { new: true }
  );
  if (!result) throw new BadRequestError("Failed to complete task");
  return handleSuccess("Task completed successfully");
};
