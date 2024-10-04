const express = require('express');
const router = express.Router();
const user = require('../controllers/user_controller');
const order = require('../controllers/order_controller');
const product = require('../controllers/product_controller');
const cart = require('../controllers/cart_controller');
const admin = require('../controllers/adminController'); // Adjust path as needed



// Ariston
router.get('/', user.index);
router.get('/login', user.login);
router.get('/register', user.register);
router.get('/home', user.home);
router.get('/shop', user.shop);
router.post('/signup', user.signup);
router.post('/authenticate', user.authenticate);
router.get('/logout', user.logout);
router.get('/view-product', user.view_product);
router.get('/cart', user.cart);
router.get('/checkout', user.checkout);
//Thiena


//Cael - where the admin_dashboard.ejs is supposed to be
// Admin Routes
router.get('/admin/dashboard', admin.isAdmin, admin.dashboard);
router.get('/admin/products', admin.isAdmin, admin.products);
router.get('/admin/orders', admin.isAdmin, admin.orders);
router.get('/admin/users', admin.isAdmin, admin.users);

// kay thien dapat
router.post('/admin/products/add', admin.isAdmin, admin.addProduct);
router.put('/admin/products/edit/:id', admin.isAdmin, admin.editProduct);
router.delete('/admin/products/delete/:id', admin.isAdmin, admin.deleteProduct);

// Admin Order Management
router.put('/admin/orders/status/:id', admin.isAdmin, admin.updateOrderStatus);

module.exports = router