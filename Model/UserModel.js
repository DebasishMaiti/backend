const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const UserModel = mongoose.model("Users", UserSchema);
module.exports = UserModel;