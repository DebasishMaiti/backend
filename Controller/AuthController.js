const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helper/AuthHelper");
const UserModel = require("../Model/UserModel");
const OrderModel = require("../Model/OrderModel")


exports.register = async (req, res) => {
    const { name, email, password, phone, address, question } = req.body;
    try {

        if (!name || !email || !password || !phone || !address || !question) {
            return res.send({
                message: "please provide valid user's Data"
            })
        }
        const ExistingUser = await UserModel.findOne({ email })
        if (ExistingUser) {
            return res.status(200).send({
                message: "Already registerd Please Login"
            })
        }
        const hashedPassword = await hashPassword(password)
        const data = new UserModel({
            name, email, password: hashedPassword, phone, address, question
        });
        const User = await data.save();
        res.status(200).json({
            message: "User Added Successfully",
            User
        })
    } catch (error) {
        res.status(400).send({
            message: error
        })
    }

}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({
                message: "Invalid Email or Password"
            })
        }
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                message: "Email is not Registered"
            })
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({
                message: "Invalid Password"
            })
        }
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            message: "Loged in Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })
    } catch (error) {
        res.status(400).send({
            message: error
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email, question, newPassword } = req.body;
        if (!email) {
            res.status(400).send({
                message: "Email is required"
            })
        }
        if (!question) {
            res.status(400).send({
                message: "Question is required"
            })
        }
        if (!newPassword) {
            res.status(400).send({
                message: "New Password is required"
            })
        }
        const user = await UserModel.findOne({ email, question })

        if (!user) {
            return res.status(400).send({
                message: "Please provide correct email or password"
            })
        }
        const hashed = await hashPassword(newPassword)
        const updatedUser = await UserModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            message: "password Updated Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Something went Wrong',
            error
        })
    }
}

exports.UpdateProfile = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        // const user = await UserModel.findById(req.user._id);

        const updatedUser = await UserModel.findByIdAndUpdate
            (req.user._id, {
                name, email, phone, address
            })

        res.status(200).send({
            message: "Profile Updated",
            updatedUser
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in update profile",
            error
        })
    }
};

exports.getOrders = async (req, res) => {
    try {

        const orders = await OrderModel
            .find()
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "error in geting orders",
            error
        })
    }
}

exports.getUserOrders = async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await OrderModel.find({ buyer: id }).populate("products", "-photo")
        res.status(200).send(
            orders
        )
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in getUserOrder"
        })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel
            .find()
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: -1 })
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "error in geting orders",
            error
        })

    }
}

exports.orderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const orders = await OrderModel.findByIdAndUpdate(id, { status }, { new: true })
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Error in Update Status',
            error
        })

    }
}

exports.test = async (req, res) => {
    res.json("debaishs")
}