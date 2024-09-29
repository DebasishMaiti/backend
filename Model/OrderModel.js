const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        ref: 'products'
    }],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: 'Users'
    },
    Buyer: {
        type: String
    },
    address: {
        type: String
    },
    status: {
        type: String,
        default: 'Not Process',
        enum: ['Not Process', 'Processing', 'Shipped', 'delivered', 'cancel']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const OrderModel = new mongoose.model('order', orderSchema);
module.exports = OrderModel;