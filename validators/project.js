const { body, param } = require("express-validator");

exports.createProjectValidator = [
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

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isMongoId()
        .withMessage("Category must be a valid MongoDB ObjectId"),

    body("assignedTo")
        .notEmpty()
        .withMessage("AssignedTo is required")
        .isMongoId()
        .withMessage("AssignedTo must be a valid MongoDB ObjectId"),

    body("status")
        .optional()
        .isIn(["Not Started", "In Progress", "Completed"])
        .withMessage("Status must be one of: Not Started, In Progress, Completed"),

    body("estimatedTime")
        .notEmpty()
        .withMessage("Estimated time is required")
        .isNumeric()
        .withMessage("Estimated time must be a number (in hours)"),

    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date must be a valid date"),

    body("dueDate")
        .notEmpty()
        .withMessage("Due date is required")
        .isISO8601()
        .withMessage("Due date must be a valid date"),

    body("completedAt")
        .optional()
        .isISO8601()
        .withMessage("Completed date must be a valid date"),
];

exports.updateProjectValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid project ID format"),

    body("title")
        .optional()
        .isString()
        .withMessage("Title must be a string"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("Category must be a valid MongoDB ObjectId"),

    body("assignedTo")
        .optional()
        .isMongoId()
        .withMessage("AssignedTo must be a valid MongoDB ObjectId"),

    body("status")
        .optional()
        .isIn(["Not Started", "In Progress", "Completed"])
        .withMessage("Status must be one of: Not Started, In Progress, Completed"),

    body("estimatedTime")
        .optional()
        .isNumeric()
        .withMessage("Estimated time must be a number"),

    body("startDate")
        .optional()
        .isISO8601()
        .withMessage("Start date must be a valid date"),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid date"),

    body("completedAt")
        .optional()
        .isISO8601()
        .withMessage("Completed date must be a valid date"),
];
