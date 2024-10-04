const express = require('express');
const router = express.Router();
const user = require('../controllers/user_controller');
const order = require('../controllers/order_controller');
const product = require('../controllers/product_controller');
const cart = require('../controllers/cart_controller');
const category = require('../controllers/category_controller');
const multer = require('multer');
const fs = require('fs');
const admin = require('../controllers/adminController'); // Adjust path as needed


//Ariston
router.get('/', user.index);
router.get('/login', user.login);
router.get('/register', user.register);
router.get('/home', user.home);
router.get('/admin', user.admin);
router.get('/shop', user.shop);
router.post('/signup', user.signup);
router.post('/authenticate', user.authenticate);

router.get('/logout', user.logout);
router.get('/view-product', user.view_product);
router.get('/cart', user.cart);
router.get('/checkout', user.checkout);
router.get('/admin/category', category.manage_category);


//Thiena
router.get('/productsCrud', product.products); 
router.post('/productsCrud', product.upload.single('image'), product.saveProduct); 
router.post('/productsCrud/update', product.upload.single('image'), product.updateProduct); 
router.get('/productsCrud/delete/:id', product.deleteProduct);


//Cael - where the admin_dashboard.ejs is supposed to be
// Admin Routes
router.get('/admin/dashboard',  admin.dashboard);
router.get('/admin/products',  admin.products);
router.get('/admin/orders', admin.orders);
router.get('/admin/users', admin.users);

// kay thien dapat
router.post('/admin/products/add', admin.addProduct);
router.put('/admin/products/edit/:id',  admin.editProduct);
router.delete('/admin/products/delete/:id', admin.deleteProduct);

// Admin Order Management
router.put('/admin/orders/status/:id', admin.updateOrderStatus);

module.exports = router