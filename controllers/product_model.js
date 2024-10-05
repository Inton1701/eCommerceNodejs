const productModel = require('../models/product_model');

// In controllers/product_model.js
exports.getShopPage = (req, res) => {
    console.log("Fetching products..."); // Add this log
    productModel.getAllProducts((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Internal Server Error');
        }
        
        console.log("Products fetched:", products); // Log the products
        // Pass products to the 'shop.ejs' view
        res.render('shop', { products: products });
    });
};

