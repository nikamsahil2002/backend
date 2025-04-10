const { body, param } = require("express-validator");

exports.createTaskValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("projectId")
    .optional()
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),

  body("media")
    .optional()
    .isString()
    .withMessage("Media must be a string"),

  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be one of: High, Medium, Low"),

  body("assignedTo")
    .isArray({ min: 1 })
    .withMessage("assignedTo must be a non-empty array")
    .custom((members) => {
      for (const member of members) {
        if (!mongoose.Types.ObjectId.isValid(member)) {
          throw new Error("Each assignedTo must be a valid MongoDB ObjectId");
        }
      }
      return true;
    }),

  body("recurrence")
    .optional()
    .isIn(["once", "daily", "weekly", "monthly"])
    .withMessage("Recurrence must be one of: once, daily, weekly, monthly"),

  body("estimatedTime")
    .optional()
    .isNumeric()
    .withMessage("Estimated time must be a number"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO date"),
];

exports.updateTaskValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID format"),

  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("projectId")
    .optional()
    .isMongoId()
    .withMessage("Project ID must be a valid MongoDB ObjectId"),

  body("media")
    .optional()
    .isString()
    .withMessage("Media must be a string"),

  body("priority")
    .optional()
    .isIn(["High", "Medium", "Low"])
    .withMessage("Priority must be one of: High, Medium, Low"),

  body("assignedTo")
    .optional()
    .isArray()
    .withMessage("assignedTo must be an array")
    .custom((members) => {
      for (const member of members) {
        if (!mongoose.Types.ObjectId.isValid(member)) {
          throw new Error("Each assignedTo must be a valid MongoDB ObjectId");
        }
      }
      return true;
    }),

  body("recurrence")
    .optional()
    .isIn(["once", "daily", "weekly", "monthly"])
    .withMessage("Recurrence must be one of: once, daily, weekly, monthly"),

  body("estimatedTime")
    .optional()
    .isNumeric()
    .withMessage("Estimated time must be a number"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO date"),
];
