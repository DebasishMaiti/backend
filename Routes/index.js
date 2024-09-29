const express = require("express");
const router = express.Router();
const AuthRoute = require("./AuthRoute");
const CategoryRoute = require("./CategoryRoute");
const ProductRoute = require("./ProductRoute");
const SubCategoryRoute = require("./SubCategoryRoute");
const ShipingRoute = require("./ShipingRoute");

router.use("/auth", AuthRoute);
router.use("/category", CategoryRoute);
router.use("/product", ProductRoute);
router.use("/subcategory", SubCategoryRoute);
router.use("/shiping", ShipingRoute);

module.exports = router;
