const db = require("../models");
const { ValidationError, DataNotFoundError, BadRequestError, ForbiddenRequestError } = require("../../utiles/customError");
const { ObjectId } = require("mongoose").Types;
const handleSuccess = require('../../utiles/successHandler');
const { default: mongoose } = require("mongoose");

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
  const type = query.type;

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

  const userFound = await db.user.aggregate([
    {
      $lookup : {
        from : 'roles',
        localField : 'roleId',
        foreignField : '_id',
        as : 'role'
      }
    },
    { $unwind : "$role" },
    { $match: { deletedAt: null, ...searchQuery } },
    {
      $facet: {
        totalResponses: [{ $count: "count" }],
        result: [
          { $sort: { updatedAt : sortOrder }},
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              email: 1,
              createdAt: 1,
              "role.roleName": 1
            }
          }
        ]
      }
    },
    {
      $project: {
        totalResponses: { $arrayElemAt: ["$totalResponses.count", 0] },
        result: 1
      }
    }
  ]);

  const totalResponses = userFound[0]?.totalResponses || 0;
  const result = userFound[0]?.result || [];

  if (result.length == 0) {
    throw new DataNotFoundError(`Data not found`);
  }
  
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

exports.updateUserById = async (_id, body, userId) => {
  if(!mongoose.isValidObjectId(_id)){
    throw new ValidationError(`${_id} is not a valid Object Id`);
  }
  const { firstName, lastName, userName, email, password, mobileNumber, role, teams = [], locations = [], access, userProfile } = body;
  const user = await db.user.findById(userId).populate("access","name");

  if(user.access.name === "Admin" && String(userId) !== String(_id)){
      throw new ForbiddenError("You are not allowed to change other Admin's Details");
  }else if(user.access.name !== "Admin" && String(userId) !== String(_id)){
      throw new ForbiddenError("You are not allowed to change other User's Details");
  }
  
  if (firstName) {
    user["firstName"] = firstName;
  }
  if (lastName) {
    user["lastName"] = lastName;
  }
  if (userName) {
    user["userName"] = userName;
  }
  if (email) {
    user["email"] = email;
  }
  if (password) {
    user["password"] = password;
  }
  if (mobileNumber) {
    user["mobileNumber"] = mobileNumber;
  }
  if (access) {
    user["access"] = access;
  }
  if (role) {
    user["role"] = role;
  }
  if(userProfile){
    user["userProfile"] = userProfile;
  }
  await user.save();

  const teamsFound = await db.team.find({ _id: { $in: teams } });
  if(Array.isArray(teams.length) && teams.length > 0){
    if (teamsFound.length !== teams.length) {
      const invalidTeams = teams.filter(teamId => !teamsFound.some(team => team._id.toString() === teamId.toString()));
      throw new ValidationError(`Please enter only existing teams. Invalid teams: ${invalidTeams}`);
    }
  
    await db.team.updateMany(
      { },
      { $pull: { users: user._id } }
    );
  
    await db.team.updateMany(
      { _id: { $in: teams } },
      { $addToSet: { users: user._id } }
    );
  }
  
  if (Array.isArray(locations) && locations.length > 0) {
    const locationsFound = await db.location.find({ _id: { $in: locations } });
    if (locationsFound.length !== locations.length) {
      const invalidLocations = locations.filter(locationId => !locationsFound.some(location => location._id.toString() === locationId.toString()));
      throw new ValidationError(`Please enter only existing locations. Invalid locations: ${invalidLocations}`);
    }
  
    await db.location.updateMany(
      { },
      { $pull: { owners: user._id } }
    );
  
    await db.location.updateMany(
      { _id: { $in: locations } },
      { $addToSet: { owners: user._id } }
    );
  }
  
  if (!user) {
    throw new BadRequestError(`No user found with Id ${_id}`);
  }
  return handleSuccess("User updated");
};

exports.deleteUserById = async (_id) => {
  const removedUser = await db.user.findOneAndUpdate(
    { _id },
    { deletedAt: new Date() },
    { new: true, projection: { email: 1 } }
  );

  if (!removedUser) {
    throw new NoDataFoundError(`No user found with Id ${_id}`);
  }
  // removing user refernce from team.users as well 
  db.team.updateMany(
    { }, 
    { $pull: { users: _id } }
  )
  // removing user reference form location owmers  as well 
  db.location.updateMany(
    { },
    { $pull: { users: _id } }
  )

  return handleSuccess("User deleted");
};



exports.fetchUserWithTeamsAndLocations = async (_id) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new BadRequestError("Invalid User ID");
  }

  const userAggregation = await db.user.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(_id) } },
    {
      $lookup: {
        from: "team",
        pipeline: [
          {
            $match: {
              $and: [
                { users: new mongoose.Types.ObjectId(_id) },
                { "deletedAt": null }
              ]
            }
          }
        ],
        as: "teams"
      }
    },
    {
      $lookup: {
        from: "location",
        pipeline: [
          {
            $match: {
              $and: [
                { owners: new mongoose.Types.ObjectId(_id) },
                { deletedAt: null }
              ]
            }
          }
        ],
        as: "locations"
      }
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        userName: 1,
        email: 1,
        mobileNumber: 1,
        "role._id": 1,
        "role.name": 1,
        "access._id": 1,
        "access.name": 1,
        teams: { _id: 1, name: 1, parentTeam: 1 },
        locations: { _id: 1, name: 1, parentTeam: 1 },
      },
    },
  ]);

  if (userAggregation.length === 0) {
    throw new NoDataFoundError(`No user found with the given ID`);
  }

  const user = userAggregation[0];

  // Build the response
  const result = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: { id: user.role?._id, name: user.role?.name },
    access: { id: user.access?._id, name: user.access?.name },
    teams: user.teams?.map((team) => ({
      _id: team._id,
      name: team.name,
      parentId: team.parentTeam
    })),
    locations: user.locations?.map((location) => ({
      _id: location._id,
      name: location.name,
      parentId: location.parentTeam
    })),
  };

  return handleSuccess("User with teams and locations", result);
};

exports.fetchUserWtihUnAssignedTeams = async () => {
  const result = await db.user.aggregate([
    {
        $lookup: {
            from: "team",
            localField: "_id",
            foreignField: "users",
            as: "teams",
        },
    },
    {
        $lookup: {
            from: "location",
            localField: "_id",
            foreignField: "owners",
            as: "locations",
        },
    },
    {
      $lookup: {
        from: "role",
        localField: "role",
        foreignField:"_id",
        as:"role"
      }
    },
    {
      $lookup: {
        from: "accesses",
        localField: "access",
        foreignField:"_id",
        as:"access"
      }
    },
    {
      $unwind: "$role" ,
    },
    {
      $unwind: "$access" ,
    },
    { 
        $match: { 
          $and: [
            { teams: { $size: 0 } },
            { locations: { $size: 0 } },
            { deletedAt: null }
          ]
        } 
    },
    {
        $project: {
            firstName: 1,
            lastName: 1,
            userName: 1,
            email: 1,
            mobileNumber: 1,
            "role._id": 1,
            "role.name": 1,
            "access._id": 1,
            "access.name": 1,
            locations: { _id: 1, name: 1, parentTeam: 1 },
            teams: { _id: 1, name: 1, parentTeam: 1 },
        },
    },
]);
if(result.length===0){
  throw new NoDataFoundError("No UnAssigned User Found")
}
return handleSuccess("UnAssigned Teams User Fetched Successfully",result);
}

exports.exportAllUser = async (email) => {
  const result = await db.user.find({}).sort({ createdAt: -1 }).populate("role","name").populate("access","name").select("firstName lastName email mobileNumber createdAt").lean();
  const fetchTeams = await db.team.find({}).lean();
  const fetchLocations = await db.location.find({}).lean();
  if(result.length === 0){
    throw new NoDataFoundError("No users available to export");
  }
  const formattedUser = result.map((data)=>({
    "First Name": data.firstName,
    "Last Name": data.lastName,
    "Email ID": data.email,
    "Permission": data.access?.name || "",
    "Role": data.role?.name || "",
    "Phone": data.mobileNumber,
    "Team": fetchTeamUsers(data._id,fetchTeams),
    "Locations": fetchUserLocation(data._id,fetchLocations),
    "Date of Joined": data.createdAt
  }))
  const data = {
      name: "Users",
      link: await createExcel(formattedUser),
  }
  const htmlTemplate = exportTemplate(data);
  sendEmail(email,"FFCorp Report Users Export",htmlTemplate,data.link);
  return handleSuccess("Users Report has been sent to email");
}