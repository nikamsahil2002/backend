const express = require("express");
const router = express.Router();

const { insertCategory, fetchAllCategories, fetchCategoryById, modifyCategoryById, removeCategory } = require("../controllers/category");
const checkAuth = require("../middlewares/checkAuth");
const checkPermission = require("../middlewares/checkPermission");
const { createCategoryValidator, updateCategoryValidator } = require("../../validators/category");
const { errorWrapper } = require("../../utils/errorWrapper");
const { validationError } = require('../../utils/validationError');

router.post("/", checkAuth, checkPermission, createCategoryValidator, validationError, errorWrapper(insertCategory));
router.get("/", checkAuth, checkPermission, errorWrapper(fetchAllCategories));
router.get("/:id", checkAuth, checkPermission, errorWrapper(fetchCategoryById));
router.put("/:id", checkAuth, checkPermission, updateCategoryValidator, validationError, errorWrapper(modifyCategoryById));
router.delete("/:id", checkAuth, checkPermission, errorWrapper(removeCategory));

module.exports = router;
