const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    quantity: {
        type: Number,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean
    },
    // salesCount: {
    //     type: Number,
    //     default: 0
    // },
    createdAt: {
        type: Date,
        default: Date.now

    }
})
const ProductModel = new mongoose.model('products', productSchema);

module.exports = ProductModel