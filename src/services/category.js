const {
    BadRequestError,
    DataNotFoundError,
  } = require("../../utils/customError");
  const db = require("../models/index");
  const handleSuccess = require("../../utils/successHandler");
  
  exports.createCategory = async (body) => {
    const result = await db.category.create(body);
    if (!result) {
      throw new BadRequestError("Error creating category");
    }
    return handleSuccess("Category created successfully");
  };
  
  exports.getAllCategories = async () => {
    const result = await db.category.find({});
    if (!result) {
      throw new DataNotFoundError("No categories found");
    }
    return handleSuccess("All categories fetched successfully", result);
  };
  
  exports.getCatergoryById = async (_id) => {
    const result = await db.category.findOne({ _id });
    if (!result) {
      throw new DataNotFoundError("Category not found");
    }
    return handleSuccess("Category fetched successfully", result);
  };
  
  exports.updateCategoryById = async (_id, body) => {
    const updateObject = { };

    if (body.name) updateObject.name = body.name;
    if (body.description) updateObject.description = body.description;

    const result = await db.category.findOneAndUpdate(
        { _id }, 
        body, 
        { new: true }
    );

    if (!result) {
      throw new DataNotFoundError("Category not found");
    }
    return handleSuccess("Category updated successfully");
  };
  
  exports.deleteCategoryById = async (_id) => {
    const result = await db.category.deleteOne({ _id });
    if (!result) {
      throw new BadRequestError("Error deleting category");
    }
    return handleSuccess("Category deleted successfully");
  };
  