const express = require('express');
const router = express.Router();
const user = require('../controllers/user_controller');
const order = require('../controllers/order_controller');
const product = require('../controllers/product_controller');
const cart = require('../controllers/cart_controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Ariston
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


router.get('/productsCrud', product.products); // Ensure product.products is defined
router.post('/productsCrud', upload.single('image'), product.saveProduct); // Ensure product.saveProduct is defined
router.post('/productsCrud/update', upload.single('image'), product.updateProduct); // Ensure product.updateProduct is defined
router.get('/productsCrud/delete/:id', product.deleteProduct); 


module.exports = router;
