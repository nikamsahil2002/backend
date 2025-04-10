const { body, param } = require("express-validator");
const passwordRegx =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

exports.validateAddUser = [
  body("firstName")
    .notEmpty()
    .withMessage("First Name is required")
    .isString()
    .withMessage("First Name should be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("First Name should be 3 to 50 characters long"),

  body("lastName")
    .notEmpty()
    .withMessage("Last Name is required")
    .isString()
    .withMessage("Last Name should be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Last Name should be 3 to 50 characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("mobile")
    .notEmpty()
    .withMessage("Mobile Number is required")
    .bail()
    .isString()
    .withMessage("Mobile number must be a string")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be exactly 10 digits"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .matches(passwordRegx)
    .withMessage(
      "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character"
    ),

  body("roleId")
    .notEmpty()
    .withMessage("roleId is required")
    .bail()
    .isMongoId()
    .withMessage("roleId should be mongoId"),
];

exports.validateUpdateUser = [
  param("id")
    .isMongoId()
    .withMessage("id should be mongoId")
    .notEmpty()
    .withMessage("id is required"),

  body("firstName")
    .optional()
    .isString()
    .withMessage("First Name should be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("First Name should be 3 to 50 characters long"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last Name should be a string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Last Name should be 3 to 50 characters long"),

  body("email").optional().isEmail().withMessage("Please enter a valid email"),

  body("mobile")
    .optional()
    .isString()
    .withMessage("Mobile number must be a string")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be exactly 10 digits"),
];

exports.validateUpdatePassword = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .bail()
    .matches(passwordRegx)
    .withMessage(
      "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character"
    ),
];

exports.validateResetPassword = [
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required ")
    .matches(passwordRegx)
    .withMessage(
      "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character"
    ),
];
