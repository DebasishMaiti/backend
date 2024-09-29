const categoryModel = require("../Model/CategoryModel");
const SubcategoryModel = require('../Model/SubcategoryModel');
const slugify = require("slugify");

exports.GetCategory = async (req, res) => {
    try {
        const category = await categoryModel.find();
        res.status(200).send({
            message: "All categories",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in get Category",
            error
        });
    }
};

exports.GetSingleCategories = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne();
        res.status(200).send({
            message: "Your Category",
            category
        })
    } catch (error) {
        console.log(error);
        res.send(500).send({
            message: 'Error in get single category',
            error
        })
    }
};

exports.CreateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ message: "Category Name Is Required" })
        }
        const ExistingCategory = await categoryModel.findOne({ name });
        if (ExistingCategory) {
            return res.status(200).send({
                message: "Category Already Exists"
            })
        }
        const category = new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).send({
            message: "New Category Created",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error,
            message: "Error in create category"
        })
    }
};

exports.UpdateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) })
        res.status(200).send({
            message: "Category Updated Successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in update category",
            error
        })
    }
};

exports.DeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        res.send({
            message: "Category Deleted Successfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Delete Category",
            error
        })
    }
};

