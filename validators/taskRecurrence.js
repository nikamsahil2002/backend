const { body, param } = require("express-validator");

exports.taskCommentsValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Task Recurrence ID format"),

  body("text")
    .notEmpty()
    .withMessage("Text is required")
    .isString()
    .withMessage("Text must be a string"),

  body("createdBy")
    .notEmpty()
    .withMessage("createdBy ID is required")
    .isMongoId()
    .withMessage("createdBy ID must be a valid MongoDB ObjectId"),
];

exports.validateTaskStatus = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Task Recurrence ID format"),

  body("status")
    .notEmpty()
    .withMessage("Text is required")
    .isIn(["Not Started", "In Progress", "Completed"])
    .withMessage('Invalid type value'),
];