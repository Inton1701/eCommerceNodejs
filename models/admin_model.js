const db = require('../config/database');

const Admin = {
    getUserById: async (userId) => {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getDashboardData: async () => {
        try {
            // Get total sales
            const [salesResult] = await db.query('SELECT SUM(total_price) as total_sales FROM orders');
            const totalSales = salesResult[0].total_sales || 0;

            // Get total orders
            const [ordersResult] = await db.query('SELECT COUNT(*) as total_orders FROM orders');
            const totalOrders = ordersResult[0].total_orders;

            // Get total products
            const [productsResult] = await db.query('SELECT COUNT(*) as total_products FROM products');
            const totalProducts = productsResult[0].total_products;

            // Get total users
            const [usersResult] = await db.query('SELECT COUNT(*) as total_users FROM users WHERE role = "customer"');
            const totalUsers = usersResult[0].total_users;

            return {
                totalSales,
                totalOrders,
                totalProducts,
                totalUsers
            };
        } catch (error) {
            throw error;
        }
    },

    getRecentOrders: async () => {
        try {
            const [orders] = await db.query(`
                SELECT o.*, u.first_name, u.last_name 
                FROM orders o 
                JOIN users u ON o.user_id = u.user_id 
                ORDER BY o.created_at DESC 
                LIMIT 10
            `);
            return orders;
        } catch (error) {
            throw error;
        }
    },

    getTopProducts: async () => {
        try {
            const [products] = await db.query(`
                SELECT p.*, 
                       COUNT(oi.product_id) as total_sold
                FROM products p
                LEFT JOIN ordered_items oi ON p.product_id = oi.product_id
                GROUP BY p.product_id
                ORDER BY total_sold DESC
                LIMIT 5
            `);
            return products;
        } catch (error) {
            throw error;
        }
    },

    getCategoryDistribution: async () => {
        try {
            const [categories] = await db.query(`
                SELECT c.name,
                       COUNT(p.product_id) as product_count,
                       ROUND(COUNT(p.product_id) * 100.0 / (SELECT COUNT(*) FROM products), 1) as percentage
                FROM categories c
                LEFT JOIN products p ON c.category_id = p.category_id
                GROUP BY c.category_id
            `);
            return categories;
        } catch (error) {
            throw error;
        }
    },

    getAllProducts: async () => {
        try {
            const [products] = await db.query(`
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.category_id
            `);
            return products;
        } catch (error) {
            throw error;
        }
    },

    getAllCategories: async () => {
        try {
            const [categories] = await db.query('SELECT * FROM categories');
            return categories;
        } catch (error) {
            throw error;
        }
    },

    addProduct: async (productData) => {
        try {
            const { name, description, price, quantity, category_id, image_path } = productData;
            await db.query(`
                INSERT INTO products (name, description, price, quantity, category_id, image_path)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [name, description, price, quantity, category_id, image_path]);
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (productId, productData) => {
        try {
            const { name, description, price, quantity, category_id, image_path } = productData;
            await db.query(`
                UPDATE products 
                SET name = ?, description = ?, price = ?, quantity = ?, 
                    category_id = ?, image_path = ?
                WHERE product_id = ?
            `, [name, description, price, quantity, category_id, image_path, productId]);
        } catch (error) {
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            await db.query('DELETE FROM products WHERE product_id = ?', [productId]);
        } catch (error) {
            throw error;
        }
    },

    getAllOrders: async () => {
        try {
            const [orders] = await db.query(`
                SELECT o.*, u.first_name, u.last_name 
                FROM orders o 
                JOIN users u ON o.user_id = u.user_id 
                ORDER BY o.created_at DESC
            `);
            return orders;
        } catch (error) {
            throw error;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            await db.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
        } catch (error) {
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const [users] = await db.query('SELECT * FROM users WHERE role = "customer"');
            return users;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Admin;