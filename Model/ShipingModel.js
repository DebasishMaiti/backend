const { Address } = require("braintree");
const mongoose = require("mongoose");

const ShipingSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ShipingModel = new mongoose.model('shiping', ShipingSchema);

module.exports = ShipingModel;