const express = require("express");
const { isLogedin, isAdmin } = require("../Middlewares/AuthGuard");
const ProductController = require("../Controller/ProductController")

const upload = require('../Middlewares/PhotoUpload')

const router = express.Router();

router.get('/get-product', ProductController.getProduct);

router.get('/get-product/:slug', ProductController.getSingleProduct);

router.get('/product-photo/:id', ProductController.getProductPhoto);

router.post('/create-product', isLogedin, isAdmin, upload.single('photo'), ProductController.createProduct);

router.put('/update-product/:id', isLogedin, isAdmin, upload.single('photo'), ProductController.updateProduct);

router.delete('/delete-product/:id', ProductController.deleteProduct);

router.post('/filter-product', ProductController.filterProduct);

router.get('/similer-product/:pid/:cid', ProductController.similerProduct);

router.get('/braintree/token', ProductController.braintreetoken);

router.post('/braintree/payment/:uid', ProductController.braintreepayment);

router.post('/braintree/payments/:uid', ProductController.braintreepayments);

router.get('/get-price-ranges', ProductController.getPriceRanges);

router.get('/best-selling-product', ProductController.getBestSellingProducts);

module.exports = router;