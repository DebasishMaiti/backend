const express = require("express");
const AuthController = require("../Controller/AuthController")
const { isLogedin, isAdmin } = require("../Middlewares/AuthGuard")
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword)


router.get("/test", isLogedin, isAdmin, AuthController.test);

router.get('/user-auth', isLogedin, (req, res) => {
    res.status(200).send({ ok: true });
});
router.get('/admin-auth', isLogedin, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

router.put('/profile', isLogedin, AuthController.UpdateProfile);

router.get('/orders', isLogedin, AuthController.getOrders);

router.get('/userOrders/:id', isLogedin, AuthController.getUserOrders);

router.get('/all-orders', isLogedin, isAdmin, AuthController.getAllOrders)

router.put('/order-status/:id', isLogedin, isAdmin, AuthController.orderStatus)

module.exports = router;