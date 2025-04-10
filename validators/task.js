const { body } = require("express-validator");

const createTaskValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be string"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid ID"),
  body("media").optional().isURL().withMessage("Media must be a valid URL"),
  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be High, Medium, or Low"),
  body("estimatedTime")
    .optional()
    .isNumeric()
    .withMessage("Estimated time must be a number"),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("AssignedTo must be a valid user ID"),
  body("status")
    .optional()
    .isIn(["Not started", "In progress", "done"])
    .withMessage("Invalid status"),
  body("completedAt")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("CompletedAt must be a valid date"),
  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("DueDate must be a valid date"),
];

const updateTaskValidator = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  body("project")
    .optional()
    .isMongoId()
    .withMessage("Project must be a valid ID"),
  body("media").optional().isURL().withMessage("Media must be a valid URL"),
  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be High, Medium, or Low"),
  body("estimatedTime")
    .optional()
    .isNumeric()
    .withMessage("Estimated time must be a number"),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("AssignedTo must be a valid user ID"),
  body("status")
    .optional()
    .isIn(["Not started", "In progress", "done"])
    .withMessage("Invalid status"),
  body("completedAt")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("CompletedAt must be a valid date"),
  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("DueDate must be a valid date"),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
};
