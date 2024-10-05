const express = require('express');
const router = express.Router();
const user = require('../controllers/user_controller');
const order = require('../controllers/order_controller');
const product = require('../controllers/product_controller');
const cart = require('../controllers/cart_controller');
const category = require('../controllers/category_controller');
const multer = require('multer');
const path = require('path');
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

router.post('/productsCrud', upload.single('image'), (req, res) => {
    console.log(req.file); 
    res.send('Product added successfully with image!');
});

router.get('/admin/dashboard',  admin.dashboard);
router.get('/admin/products', product.products); // Ensure product.products is defined
router.post('/admin/products/add', upload.single('image'), product.saveProduct); // Ensure product.saveProduct is defined
router.post('/admin/products/update', upload.single('image'), product.updateProduct); // Ensure product.updateProduct is defined
router.get('/admin/products/delete/:id', product.deleteProduct); 


module.exports = router;



//Cael - where the admin_dashboard.ejs is supposed to be
// Admin Routes
// router.get('/admin/dashboard',  admin.dashboard);
// router.get('/admin/products',  admin.products);
// router.get('/admin/orders', admin.orders);
// router.get('/admin/users', admin.users);

// // kay thien dapat
// router.post('/admin/products/add', admin.addProduct);
// router.put('/admin/products/edit/:id',  admin.editProduct);
// router.delete('/admin/products/delete/:id', admin.deleteProduct);

// Admin Order Management
router.put('/admin/orders/status/:id', admin.updateOrderStatus);

module.exports = router