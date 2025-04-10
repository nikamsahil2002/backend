const express = require("express");
const { insertCategory, fetchAllCategories, fetchCategoryById, modifyCategoryById, removeCategory } = require("../controllers/category");
const checkAuth = require("../middlewares/checkAuth");
const checkPermission = require("../middlewares/checkPermission");
const { createCategoryValidator, updateCategoryValidator } = require("../../validators/category");
const { errorWrapper } = require("../../utils/errorWrapper");
const router = express.Router();

router.post("/", checkAuth, checkPermission, createCategoryValidator, errorWrapper(insertCategory));
router.get("/", checkAuth, checkPermission, errorWrapper(fetchAllCategories));
router.get("/:id", checkAuth, checkPermission, errorWrapper(fetchCategoryById));
router.put("/:id", checkAuth, checkPermission, updateCategoryValidator, errorWrapper(modifyCategoryById));
router.delete("/:id", checkAuth, checkPermission, errorWrapper(removeCategory));

module.exports = router;
