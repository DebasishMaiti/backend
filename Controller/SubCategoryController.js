const SubcategoryModel = require('../Model/SubcategoryModel');
const slugify = require("slugify");

exports.CreateSubCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { parentCategoryId } = req.params;

        const data = new SubcategoryModel({
            name,

            parentCategory: parentCategoryId
        })
        const subcategory = data.save()
        res.status(201).send({
            message: "New subCategory Created",
            subcategory
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in create Subcategory",
            error
        })
    }
};

exports.GetSubCategory = async (req, res) => {
    try {
        const { parentCategoryId } = req.params;
        const subcategories = await SubcategoryModel.find({ parentCategory: parentCategoryId });
        res.status(200).send({
            message: "SubCategories Retrieved Successfully",
            subcategories
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in get Subcategory",
            error
        })

    }
};

exports.UpdateSubCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const subcategory = await SubcategoryModel.findByIdAndUpdate(id, {
            name, slug: slugify(name)
        }, { new: true })
        res.status(200).send({
            message: "subCategory Updated Successfully",
            subcategory
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in update Subcategory",
            error
        })
    }
};

exports.DeleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await SubcategoryModel.findByIdAndDelete(id);
        res.status(200).send({
            message: "Sub category Deleted"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Delete Subcategory",
            error
        })

    }
};