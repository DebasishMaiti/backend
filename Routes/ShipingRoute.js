const express = require('express');
const router = express.Router()
const ShipingController = require("../Controller/ShipingController");

router.get('/get-shiping', ShipingController.getShiping);

router.get('/get-shipings/:id', ShipingController.getShipings);

router.get('/get-user-shipings/:id', ShipingController.getUserShipings);

router.post('/add-shiping/:orderId/:userId', ShipingController.addShiping);

router.put('/update-shiping', ShipingController.updateShiping);

router.delete('/delete-shiping', ShipingController.deleteShiping);


module.exports = router