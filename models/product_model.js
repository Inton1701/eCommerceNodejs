const db = require('../config/database');


const product = {

    //Ariston




    //Thiena Maganda & Ariston
    // Save a new product
    save: (insert, callback) => {
        const productInsertQuery = `INSERT INTO products (name, description, price, quantity, category_id, image_path)VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(productInsertQuery, [insert.name, insert.description, insert.price, insert.quantity,Number(insert.category_id), insert.image_path], (err, result) => {
            if (err) {
                return callback(err);
            }
           callback(null, result);
        });
    },
    

    // Get all products with categories ang hirap inaka 
    getAllProducts: (callback) => {
        const query = `SELECT products.product_id, products.name, products.description, products.price, products.quantity, products.image_path, categories.name AS category_name
FROM products
LEFT JOIN categories ON products.category_id = categories.category_id`;
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching products:", err); 
                return callback(err);
            }
            callback(null, results);
        });
    },
    getProduct: (productId, callback) => {
        const query = 'SELECT * FROM products WHERE product_id = ?';
        db.query(query, [productId], (err, result) => {
            if (err) {
                return callback(err); 
            }

            callback(null, result.length > 0 ? result[0] : null);
        });
    },

    // Update an existing product
    update: (productId, updateData, callback) => {
    
        const query = ` UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image_path = ?, category_id = ? WHERE product_id = ?`;
        db.query(query, [updateData.name, updateData.description, updateData.price, updateData.quantity, updateData.image_path, updateData.category_id, productId], callback);
    },

    delete: (productId, callback) => {
        const query = "DELETE FROM products WHERE product_id = ?";
        db.query(query, [productId], callback);
    }
    

    //Cael
    
};

module.exports = product;
