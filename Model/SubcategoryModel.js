const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },

    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
});

const SubcategoryModel = mongoose.model('Subcategory', subcategorySchema);

module.exports = SubcategoryModel;
