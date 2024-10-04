const db = require('../config/database');


const product = {

    //Ariston




    //Thiena Maganda
    // Save a new product
    save: (insert, callback) => {
        const productInsertQuery = `INSERT INTO products (name, description, price, quantity, category_id, solds, returns, image_path)VALUES (?, ?, ?, ?, NULL, ?, ?, ?)`;
        db.query(productInsertQuery, [insert.name, insert.description, insert.price, insert.quantity, insert.solds || 0, insert.returns || 0, insert.image_path], (err, result) => {
            if (err) {
                return callback(err);
            }
            const productId = result.insertId; 
            const categoryInsertQuery = `INSERT INTO categories (name) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS (SELECT name FROM categories WHERE name = ?)`;
            db.query(categoryInsertQuery, [insert.category_name, insert.category_name], (err) => {
                if (err) return callback(err);
    
                const updateCategoryQuery = ` UPDATE products  SET category_id = (SELECT category_id FROM categories WHERE name = ?) WHERE product_id = ? `;
    
                db.query(updateCategoryQuery, [insert.category_name, productId], (err) => {
                    if (err) return callback(err);
                    callback(null); 
                });
            });
        });
    },
    

    // Get all products with categories ang hirap inaka 
    getAllProducts: (callback) => {
        const query = `SELECT p.product_id, p.name AS product_name, p.description, p.price, p.quantity, p.solds, p.returns, p.image_path, c.name AS category_name FROM products p LEFT JOIN  categories c ON p.category_id = c.category_id`;
        db.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching products:", err); 
                return callback(err);
            }
            callback(null, results);
        });
    },
    

    // Update an existing product
    update: (productId, updateData, callback) => {
        if (!updateData.category_name) {
            return callback(new Error('Category name cannot be null'));
        }

        const categoryInsertQuery = `INSERT INTO categories (name) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS (SELECT name FROM categories WHERE name = ?)`;
        
        db.query(categoryInsertQuery, [updateData.category_name, updateData.category_name], (err) => {
            if (err) return callback(err);

            const query = ` UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image_path = ?, category_id = (SELECT category_id FROM categories WHERE name = ?), solds = ?, returns = ?  WHERE product_id = ?`;
            db.query(query, [updateData.name, updateData.description, updateData.price, updateData.quantity, updateData.image_path, updateData.category_name, updateData.solds, updateData.returns, productId], callback);
        });
    },

    delete: (productId, callback) => {
        const query = "DELETE FROM products WHERE product_id = ?";
        db.query(query, [productId], callback);
    }
    

    //Cael
    
};

module.exports = product;
