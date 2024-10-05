const multer = require('multer');
const path = require('path');
const p = require('../models/product_model'); // Import the product model
const categories = require('../models/category_model'); // Import the category model
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
            image_path: imagePath,
            category_id: req.body.category_id 
        };

        console.log("New product data:", newProduct);

        p.save(newProduct, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving product');
            }
            res.redirect('/admin/products');
        });
    },

    // Update product
    updateProduct: (req, res) => {
        const productId = req.body.productId;
        let imagePath = req.body.currentImagePath; // Assuming this is the current image path
    
        // If a new image is uploaded, update the image path
        if (req.file) {
            imagePath = req.file.filename;
        }
    
        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            image_path: imagePath,
            category_id: req.body.category_id
        };
    
        console.log("Updated product data:", updatedData);
    
        // Update product in the database
        p.update(productId, updatedData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating product');
            }
            res.redirect('/admin/products');
        });
    },
    

    // Delete a product by its ID
    deleteProduct: (req, res) => {
        const productId = req.params.id;

        p.delete(productId, (err) => {
            if (err) {
                if (err.message === 'Product not found') {
                    return res.status(404).send('Product not found');
                }
                console.error(err);
                return res.status(500).send('Error deleting product');
            }
            res.redirect('/admin/products'); // Redirect after successful deletion
        });
    },

    // Fetch all products
    products: (req, res) => {
        p.getAllProducts((err, products) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching products');
            }
            categories.getAll((err, categ) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error fetching categories');
                }
                res.render('admin-product', { products, categ }); // Render your EJS view with products and categories
            })
  
        });
    },

};

module.exports = products;
