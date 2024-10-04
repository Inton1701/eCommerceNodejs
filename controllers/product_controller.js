const p = require('../models/product_model'); // Import the product model

const products = {
    // Save product
    saveProduct: (req, res) => {
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.filename;
        }

        const newProduct = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            solds: 0,
            returns: 0,
            image_path: imagePath,
            category_name: req.body.category_name 
        };

        console.log("New product data:", newProduct); // Debug log

        p.save(newProduct, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving product');
            }
            res.redirect('/productsCrud');
        });
    },

    // Update product
    updateProduct: (req, res) => {
        const productId = req.body.productId;
        let imagePath = null;

        if (req.file) {
            imagePath = req.file.filename;
        }

        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            image_path: imagePath,
            category_name: req.body.category_name
        };

        console.log("Updated product data:", updatedData); // Debug log

        p.update(productId, updatedData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating product');
            }
            res.redirect('/productsCrud');
        });
    },

    // Delete a product by its ID
    deleteProduct: (req, res) => {
        const productId = req.params.id; // Assuming the ID comes from the route parameters

        p.delete(productId, (err) => {
            if (err) {
                if (err.message === 'Product not found') {
                    return res.status(404).send('Product not found');
                }
                console.error(err);
                return res.status(500).send('Error deleting product');
            }
            res.redirect('/productsCrud'); // Redirect after successful deletion
        });
    },

    // Fetch all products
    products: (req, res) => {
        p.getAllProducts((err, products) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching products');
            }
            res.render('products_crud', { products }); // Render your EJS view with products
        });
    },
};

module.exports = products;
