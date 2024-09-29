const express = require("express");
const { isLogedin, isAdmin } = require("../Middlewares/AuthGuard");
const SubCategoryController = require("../Controller/SubCategoryController")

const router = express.Router();

router.post('/create-subcategory/:parentCategoryId', SubCategoryController.CreateSubCategory);

router.get('/get-subcategory/:parentCategoryId', SubCategoryController.GetSubCategory);

router.put('/update-subcategory/:id', SubCategoryController.UpdateSubCategory);

router.delete('/delete-subcategory/:id', SubCategoryController.DeleteSubCategory);

module.exports = router;
