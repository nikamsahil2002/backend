const db = require("../models");
const { ValidationError, DataNotFoundError, BadRequestError, ForbiddenRequestError } = require("../../utils/customError");
const { ObjectId } = require("mongoose").Types;
const handleSuccess = require('../../utils/successHandler');
const { default: mongoose } = require("mongoose");
const commonFunction = require('../../utils/commonFunctions');

exports.createUser = async (userData) => {
  const { firstName, lastName, email, password, avatar, roleId } = userData;

  // check if user with email already exist
  const userExist = await db.user.findOne({
    email
  });
  if(userExist){
    throw new BadRequestError(`User with email ${email} already exist`);
  }

  const userCreated = await db.user.create({
    firstName,
    lastName,
    email,
    password,
    avatar,
    roleId
  });

  if (!userCreated) {
    throw new BadRequestError(`Data not added`);
  }

  return handleSuccess("User created successfully");
};

exports.fetchUserDetails = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const search = query.search || "";
  const sortOrder = parseInt(query.sortOrder) || -1;
  const sortField = query.sortField || "updatedAt";

  const searchQuery = {
    $and: [
      {
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email : { $regex: search, $options: "i" } },
          { "role.name" : { $regex: search, $options: "i" } }
        ]
      }
    ]
  }

  const lookupFields = [
    {
      $lookup : {
        from : 'roles',
        localField : 'roleId',
        foreignField : '_id',
        as : 'role'
      }
    },
    { $unwind : "$role" },
  ];

  const projectFields = {
    firstName: 1,
    lastName: 1,
    email: 1,
    createdAt: 1,
    "role.roleName": 1
  }

  const sortObject = {};
  sortObject[sortField] =  sortOrder;

  const userFound = await commonFunction.findAll(db.user, searchQuery, sortObject, skip, limit, projectFields, lookupFields)

  const totalResponses = userFound[0]?.totalResponses || 0;
  const result = userFound[0]?.result || [];
  
  const data = {
    pageNumber,
    limit,
    totalResponses,
    totalPages: Math.ceil(totalResponses / limit),
    responses: result,
  };
  return handleSuccess("User found", data);
};

exports.fetchUserById = async (_id) => {
  if(!mongoose.isValidObjectId(_id)){
    throw new ValidationError(`${_id} is not a valid Object Id`);
  }
  const userFound = await db.user
    .findById(_id)
    .populate({
      path: "roleId",
      select: "roleName",
      as: "role"
    })
    .select("firstname lastName email avatar status role")

  if (!userFound) {
    throw new DataNotFoundError(`No user found with Id ${_id}`);
  } 
  return handleSuccess("User found", userFound);
};

exports.updateUserById = async (_id, body) => {
  const updateUser = await db.user.findOneAndUpdate(
    { _id },
    body
  );
  if (!updateUser) {
    throw new BadRequestError(`No user found with Id ${_id}`);
  }
  return handleSuccess("User updated");
};

exports.deleteUserById = async (_id) => {
  const removedUser = await db.user.findOneAndUpdate(
    { _id },
    { deletedAt: new Date() },
  );

  if (!removedUser) {
    throw new NoDataFoundError(`No user found with Id ${_id}`);
  }
  // removing user refernce from team as well 

  return handleSuccess("User deleted");
};