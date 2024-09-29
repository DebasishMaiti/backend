const ShipingModel = require("../Model/ShipingModel");

exports.getShiping = async (req, res) => {
    try {
        const shiping = await ShipingModel.find();
        res.status(200).send({
            message: "Shiping list",
            shiping
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in get Shiping",
            error
        })
    }
};

exports.getShipings = async (req, res) => {
    try {
        const { id } = req.params;
        const shiping = await ShipingModel.find({ orderId: id });
        res.status(200).send({ shiping })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in get Shiping",
            error
        })
    }
};

exports.getUserShipings = async (req, res) => {
    try {
        const { id } = req.params;
        const shiping = await ShipingModel.find({ userId: id });
        res.status(200).send({ shiping })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in get Shiping",
            error
        })
    }
};

exports.addShiping = async (req, res) => {
    try {
        const { orderId, userId } = req.params;
        const { name, email, phone, address, city, state, zip } = req.body;

        const data = new ShipingModel({
            orderId,
            userId: userId,
            name,
            email,
            phone,
            address,
            city,
            state,
            zip
        });
        const shiping = await data.save();
        res.status(200).send({
            message: 'Shiping added successfully',
            shiping
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in add Shiping",
            error
        })
    }
};

exports.updateShiping = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in update Shiping",
            error
        })
    }
};

exports.deleteShiping = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in delete shipnig",
            error
        })
    }
}