const db = require('../config/database');

const Admin = {
    getUserById: (userId, callback) => {
        db.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
            if (error) return callback(error);
            callback(null, results[0]);
        });
    },

    getDashboardData: (callback) => {
        let totalSales = 0;
        let totalOrders = 0;
        let totalProducts = 0;
        let totalUsers = 0;
        db.query('SELECT SUM(total_price) as total_sales FROM orders', (error, salesResult) => {
            if (error) return callback(error);
             totalSales = salesResult[0].total_sales || 0;

            db.query('SELECT COUNT(*) as total_orders FROM orders', (error, ordersResult) => {
                if (error) return callback(error);
                 totalOrders = ordersResult[0].total_orders;

                db.query('SELECT COUNT(*) as total_products FROM products', (error, productsResult) => {
                    if (error) return callback(error);
                     totalProducts = productsResult[0].total_products;

                    db.query('SELECT COUNT(*) as total_users FROM users WHERE role = "customer"', (error, usersResult) => {
                        if (error) return callback(error);
                         totalUsers = usersResult[0].total_users;

                        const dashboardData = {
                            totalSales,
                            totalOrders,
                            totalProducts,
                            totalUsers,
                        };

                        callback(null, dashboardData);
                    });
                });
            });
        });
    },

    getRecentOrders: (callback) => {
        db.query(`
            SELECT o.*, u.first_name, u.last_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.user_id 
            ORDER BY o.created_at DESC 
            LIMIT 10
        `, (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },

    getTopProducts: (callback) => {
        db.query(`
            SELECT p.*, COUNT(oi.product_id) as total_sold
            FROM products p
            LEFT JOIN ordered_items oi ON p.product_id = oi.product_id
            GROUP BY p.product_id
            ORDER BY total_sold DESC
            LIMIT 5
        `, (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },

    getCategoryDistribution: (callback) => {
        db.query(`
            SELECT c.name, COUNT(p.product_id) as product_count, 
                   ROUND(COUNT(p.product_id) * 100.0 / (SELECT COUNT(*) FROM products), 1) as percentage
            FROM categories c
            LEFT JOIN products p ON c.category_id = p.category_id
            GROUP BY c.category_id
        `, (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },

    getAllProducts: (callback) => {
        db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.category_id
        `, (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },

    getAllCategories: (callback) => {
        db.query('SELECT * FROM categories', (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },

    addProduct: (productData, callback) => {
        const { name, description, price, quantity, category_id, image_path } = productData;
        db.query(`
            INSERT INTO products (name, description, price, quantity, category_id, image_path)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, description, price, quantity, category_id, image_path], (error) => {
            if (error) return callback(error);
            callback(null);
        });
    },

    updateProduct: (productId, productData, callback) => {
        const { name, description, price, quantity, category_id, image_path } = productData;
        db.query(`
            UPDATE products 
            SET name = ?, description = ?, price = ?, quantity = ?, 
                category_id = ?, image_path = ?
            WHERE product_id = ?
        `, [name, description, price, quantity, category_id, image_path, productId], (error) => {
            if (error) return callback(error);
            callback(null);
        });
    },

    deleteProduct: (productId, callback) => {
        db.query('DELETE FROM products WHERE product_id = ?', [productId], (error) => {
            if (error) return callback(error);
            callback(null);
        });
    },

    getAllOrders: (callback) => {
        db.query(`
            SELECT o.*, u.first_name, u.last_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.user_id 
            ORDER BY o.created_at DESC
        `, (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },

    updateOrderStatus: (orderId, status, callback) => {
        db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId], (error) => {
            if (error) return callback(error);
            callback(null);
        });
    },

    getAllUsers: (callback) => {
        const query = `SELECT * FROM users WHERE role = 'customer'`;
                db.query(query, (err, results) => {
                    if (err) {
                        console.error("Error fetching users", err); 
                        return callback(err);
                    }
                    callback(null, results);
                });
    },
    updateUsers: (user_id, updateData, callback) => {
        const query = ` UPDATE users SET first_name = ?, last_name = ?, email = ?, birthdate = ? WHERE user_id = ?`;
        db.query(query, [updateData.first_name, updateData.last_name, updateData.email, updateData.birthdate, user_id], callback);
    },
    deleteUsers: (user_id, callback) => {
        db.query('DELETE FROM users WHERE user_id = ?', [user_id], (error) => {
            if (error) return callback(error);
            callback(null);
        });
    },
};

module.exports = Admin;
