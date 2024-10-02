const express = require('express');
const router = express.Router();
const user = require('../controllers/user_controller');
const order = require('../controllers/order_controller');
const product = require('../controllers/product_controller');
const cart = require('../controllers/cart_controller');


// Ariston
router.get('/', user.index);
router.get('/login', user.login);
router.get('/register', user.register);
router.post('/signup', user.signup);
router.post('/authenticate', user.authenticate);

//Thiena


//Cael


module.exports = router