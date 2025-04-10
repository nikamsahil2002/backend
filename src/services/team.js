const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const commonFunction = require('../../utils/commonFunctions');

const { DataNotFoundError, BadRequestError,} = require("../../utils/customError");

exports.createTeam = async (body) => {
  const {
    name,
    lead,
    members
  } = body;

  const addTeam = await db.team.create({
    name,
    lead,
    members
  });

  if (!addTeam) {
    throw new BadRequestError("Failed to create team");
  }

  return handleSuccess("Team created Successfully");
};

exports.getAllTeam = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const search = query.search || "";
  const sortOrder = parseInt(query.sortOrder) || -1;
  const sortField = query.sortField || "updatedAt";

  const searchQuery = {
    $or: [
        { name: { $regex: search, $options: "i" } },
    ],
  };

  const projectFields = {
    name: 1,
    "lead._id": 1,
    "lead.firstName": 1,
    "lead.lastName": 1,
    "lead.email": 1,
    "members._id": 1,
    "members.firstName": 1,
    "members.lastName": 1,
    "members.email": 1,
    createdAt: 1
  }

  const lookupFields = [
    {
        $lookup : {
          from : 'users',
          localField : 'lead',
          foreignField : '_id',
          as : 'lead'
        }
    },
    {
        $lookup : {
          from : 'users',
          localField : 'members',
          foreignField : '_id',
          as : 'members'
        }
    },
    { $unwind : "$lead" },
  ];
  const sortObject = {};
  sortObject[sortField] =  sortOrder;

  const teamsData = await commonFunction.findAll(db.team, searchQuery, sortObject, skip, limit, projectFields, lookupFields);

  const totalResponses = teamsData[0]?.totalResponses || 0;
  const result = teamsData[0]?.result || [];

  if (result.length == 0) {
    throw new DataNotFoundError("No Team found");
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

exports.getTeamById = async (_id) => {
    const teamData = await db.team
        .findById(_id)
        .populate({
            path: "lead",
            select: "firstName lastName email"
        })
        .populate({
            path: "members",
            select: "firstName lastName email"
        })
        .select("name lead members")

    if (!teamData) {
        throw new DataNotFoundError("Team not found");
    }

    return handleSuccess("Team fetched successfully", teamData);
}


exports.updateTeamById = async (_id, body) => {
    const updatedTeam = await db.team.findByIdAndUpdate(
        _id, 
        body, 
        { new: true }
    );

    if (!updatedTeam) {
        throw new BadRequestError("Failed to update team");
    }
    return handleSuccess("Team updated successfully");
}


exports.deleteTeamById = async (_id) => {
    const isTeamDeleted = await db.team.findByIdAndUpdate(
        _id,
        { deletedAt: new Date() },
        { new: true }
    ); 
    if (!isTeamDeleted) {
        throw new BadRequestError("Failed to delete team");
    }
    return handleSuccess("Team deleted successfully");
}

