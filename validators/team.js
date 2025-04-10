const { body } = require("express-validator");
const mongoose = require("mongoose");

exports.createTeamValidator = [
  body("name")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be string"),

  body("lead")
    .notEmpty()
    .withMessage("Lead is required")
    .isMongoId()
    .withMessage("Lead Id must be a valid ID"),

  body("members")
    .isArray()
    .withMessage('Please list the members associated with the team.')
    .custom((members) => {
        for (const member of members) {
          if (!mongoose.Types.ObjectId.isValid(member)) {
            throw new Error('Each member must be a valid MongoDB ObjectId.');
          }
        }
        return true;
    })
];

exports.updateTeamValidator = [
    body("name")
      .optional()
      .isString()
      .withMessage("Title must be a string"),
  
    body("lead")
      .optional()
      .isMongoId()
      .withMessage("Lead Id must be a valid ID"),
  
    body("members")
      .optional()
      .isArray()
      .withMessage('Members must be an array.')
      .custom((members) => {
        for (const member of members) {
          if (!mongoose.Types.ObjectId.isValid(member)) {
            throw new Error('Each member must be a valid MongoDB ObjectId.');
          }
        }
        return true;
      })
  ];
