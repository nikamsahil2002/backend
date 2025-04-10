const { BadRequestError, DataNotFoundError, } = require("../../utils/customError");
const db = require("../models/index");
const handleSuccess = require("../../utils/successHandler");
const commonFunction = require('../../utils/commonFunctions');

exports.createCategory = async (body) => {
  const result = await db.category.create(body);
  if (!result) {
    throw new BadRequestError("Error creating category");
  }
  return handleSuccess("Category created successfully");
};

exports.getAllCategories = async (query) => {
  const pageNumber = parseInt(query.pageNumber) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (pageNumber - 1) * limit;
  const search = query.search || "";
  const sortOrder = parseInt(query.sortOrder) || -1;
  const sortField = query.sortField || "updatedAt";

  const searchQuery = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ]
  }
  const projectFields = {
    name: 1,
    description: 1,
    createdAt: 1
  }

  const sortObject = {};
  sortObject[sortField] =  sortOrder;

  const categoryData = await commonFunction.findAll(db.category, searchQuery, sortObject, skip, limit, projectFields, []);

  const totalResponses = categoryData[0]?.totalResponses || 0;
  const result = categoryData[0]?.result || [];

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
  return handleSuccess("All categories fetched successfully", data);
};

exports.getCatergoryById = async (_id) => {
  const result = await db.category.findOne({ _id });
  if (!result) {
    throw new DataNotFoundError("Category not found");
  }
  return handleSuccess("Category fetched successfully", result);
};

exports.updateCategoryById = async (_id, body) => {
  const updateObject = {};

  if (body.name) updateObject.name = body.name;
  if (body.description) updateObject.description = body.description;

  const updateCategory = await db.category.findOneAndUpdate(
    { _id },
    updateObject,
    { new: true }
  );

  if (!updateCategory) {
    throw new DataNotFoundError("Category not found");
  }
  return handleSuccess("Category updated successfully");
};

exports.deleteCategoryById = async (_id) => {
  const removeCategory = await db.category.findOneAndUpdate(
    { _id },
    { deletedAt: new Date() }
  );
  if (!removeCategory) {
    throw new BadRequestError("Error deleting category");
  }
  return handleSuccess("Category deleted successfully");
};
