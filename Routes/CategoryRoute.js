const express = require("express");
const { isLogedin, isAdmin } = require("../Middlewares/AuthGuard");
const CategoryController = require("../Controller/CategoryController")

const router = express.Router();

router.get('/get-category', CategoryController.GetCategory);
router.get('/get-single-category/:id', CategoryController.GetSingleCategories);

router.post('/create-category', isLogedin, isAdmin, CategoryController.CreateCategory);

router.put('/update-category/:id', isLogedin, isAdmin, CategoryController.UpdateCategory);

router.delete('/delete-category/:id', isLogedin, isAdmin, CategoryController.DeleteCategory);

module.exports = router;