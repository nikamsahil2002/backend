const db = require("../models/index");
const handleSuccess = require("../../utils/");
const { ObjectId } = require('mongoose').Types;
const {
  DataNotFoundError,
  BadRequestError,
} = require("../../utils/customError");
const { isValidObjectId } = require("mongoose");

const { ObjectId } = require("mongoose").Types;

exports.createTask = async (body) => {
  const {
    title,
    description,
    status,
    category,
    project,
    dueDate,
    assignedTo,
    media,
    priority,
    estimatedTime,
  } = body;
  const task = await db.task.create({
    title,
    description,
    status,
    category,
    project,
    dueDate,
    media,
    assignedTo,
    priority,
    estimatedTime,
  });

  if (!task) {
    throw new BadRequestError("Failed to create task");
  }

  return handleSuccess("Task created Successfully");
};

exports.getAllTasks = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const assignedTo = query.assignedTo;
  const project = query.project;
  const category = query.category;
  const status = query.status;
  const search = query.search || "";

  const conditions = {};
  if (assignedTo) {
    conditions["assignedTo"] = new ObjectId(assignedTo);
  }

  if (project) {
    conditions["project"] = new ObjectId(project);
  }

  if (category) {
    conditions["category"] = new ObjectId(category);
  }

  if (status) {
    conditions["status"] = status;
  }

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
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$project",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: { ...searchQuery, deletedAt: null },
    },
    {
      $facet: {
        totalResponses: [{ $count: "count" }],
        result: [
          { $sort: { created: -1 } },
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

  if (result.length == 0) {
    throw new DataNotFoundError("No Tasks found");
  }
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

    if (!result) {
        throw new DataNotFoundError("Task not found");
    }

    return handleSuccess("Task fetched successfully", _id);
}


exports.updateTaskById = async (_id, body) => {
    const updateObject = {};
    const { 
        title,
        description,
        status,
        category,
        project,
        dueDate,
        assignedTo,
        media,
        priority,
        estimatedTime 
    } = body;

    if (title) updateObject.title = title;
    if (description) updateObject.description = description;
    if (status) updateObject.status = status;
    if (category) updateObject.category = category;
    if (project) updateObject.project = project;
    if (dueDate) updateObject.dueDate = dueDate;
    if (assignedTo) updateObject.assignedTo = assignedTo;
    if (media) updateObject.media = media;
    if (priority) updateObject.priority = priority;
    if (estimatedTime) updateObject.estimatedTime = estimatedTime;
    

    const result = await db.task.findByIdAndUpdate(
        _id, 
        updateObject, 
        { new: true }
    );

    if (!result) {
        throw new BadRequestError("Failed to update task");
    }

    return handleSuccess("Task updated successfully");
}


exports.deleteTaskById = async (_id) => {
    const result = await db.task.findByIdAndUpdate(
        _id,
        { deletedAt: new Date() },
        { new: true }
    ); 
    if (!result) {
        throw new BadRequestError("Failed to delete task");
    }
    return handleSuccess("Task deleted successfully");
}

exports.completeTask = async (_id) => {
    const result = await db.task.findByIdAndUpdate(
        _id,
        { status: "done", completedAt: new Date() },
        { new: true }
    );

    if (!result) {
        throw new BadRequestError("Failed to complete task");
    }

    return handleSuccess("Task completed successfully");
}
