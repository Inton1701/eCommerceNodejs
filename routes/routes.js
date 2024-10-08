const express = require('express');
const router = express.Router();
const user = require('../controllers/user_controller');
const product = require('../controllers/product_controller');
const carts = require('../controllers/cart_controller');
const multer = require('multer');
const path = require('path');
const admin = require('../controllers/adminController'); 



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
router.get('/view-product/:id', user.viewProduct);

router.get('/cart', user.cart);
router.get('/checkout', user.checkout);
router.post('/checkout/place_order', user.placeOrders);
router.get('/checkout/success', user.thankYou)

router.get('/cart/count', carts.getCartCount);
router.post('/cart/update', carts.updateCart);
router.get('/cart/delete/:cart_id', carts.deleteCart);

router.get('/shop/addCart/:id', carts.addCart);




router.get('/admin/category', admin.category);
router.post('/admin/category/update', admin.update_category);
router.get('/admin/category/delete/:category_id', admin.delete_category); 
router.get('/admin/users', admin.users);
router.post('/admin/users/update', admin.update_user);
router.get('/admin/users/delete/:user_id', admin.delete_user);
router.get('/admin/orders', admin.order);
router.post('/admin/orders/update', admin.update_order);
router.get('/admin/orders/delete/:order_id', admin.delete_orders); 

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

//ariston
router.get('/admin/dashboard',  admin.dashboard);
router.get('/admin/products', product.products); 
router.post('/admin/products/add', upload.single('image'), product.saveProduct);
router.post('/admin/products/update', upload.single('image'), product.updateProduct); 
router.get('/admin/products/delete/:id', product.deleteProduct); 

//Cael 

// router.get('/shop', productController.getShopPage);


module.exports = router