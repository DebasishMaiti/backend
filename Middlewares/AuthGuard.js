const jwt = require("jsonwebtoken");
const UserModel = require("../Model/UserModel");

exports.isLogedin = async (req, res, next) => {
    const token = req.header("Authorization");
    try {
        if (!token) {
            res.status(400).json({
                message: "please provide Authorization token"
            })
        } else {
            const tokenData = await jwt.verify(token, process.env.JWT_SECRET);
            if (!tokenData._id) {
                res.status(401).json({
                    message: "invalid token"
                })
            }
            req.user = tokenData
            next()

        }
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
};

exports.isAdmin = async (req, res, next) => {

    try {
        const user = await UserModel.findById(req.user._id)
        if (user.role !== 1) {
            res.status(400).json({
                message: "Unauthirized Access"
            })
        } else {
            next()
        }
    } catch (error) {
        console.log("ffwrf");
        res.status(400).json({
            message: error
        })
    }
}