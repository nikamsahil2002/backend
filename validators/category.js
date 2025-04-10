const { body, param } = require("express-validator");

const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

const updateCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid category ID format"),

  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};
