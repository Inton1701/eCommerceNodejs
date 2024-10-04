const Admin = require('../models/admin_model');

const adminController = {
    // Middleware to check if user is admin
    isAdmin: async (req, res, next) => {
        if (!req.session.user_id) {
            return res.redirect('/login');
        }
        try {
            const user = await Admin.getUserById(req.session.user_id);
            if (user && user.role === 'admin') {
                next();
            } else {
                res.status(403).send('Access denied');
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            res.status(500).send('Server error');
        }
    },

    // Dashboard
    dashboard: async (req, res) => {
        try {
            const dashboardData = await Admin.getDashboardData();
            const recentOrders = await Admin.getRecentOrders();
            const topProducts = await Admin.getTopProducts();
            const categories = await Admin.getCategoryDistribution();

            res.render('admin/dashboard', {
                ...dashboardData,
                recentOrders,
                topProducts,
                categories
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
            res.status(500).send('Error loading dashboard');
        }
    },

    // Products Management
    products: async (req, res) => {
        try {
            const products = await Admin.getAllProducts();
            const categories = await Admin.getAllCategories();
            res.render('admin/products', { products, categories });
        } catch (error) {
            console.error('Error loading products:', error);
            res.status(500).send('Error loading products');
        }
    },

    addProduct: async (req, res) => {
        try {
            const productData = req.body;
            await Admin.addProduct(productData);
            res.redirect('/admin/products');
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).send('Error adding product');
        }
    },

    editProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            const productData = req.body;
            await Admin.updateProduct(productId, productData);
            res.redirect('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).send('Error updating product');
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            await Admin.deleteProduct(productId);
            res.redirect('/admin/products');
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).send('Error deleting product');
        }
    },

    // Orders Management
    orders: async (req, res) => {
        try {
            const orders = await Admin.getAllOrders();
            res.render('admin/orders', { orders });
        } catch (error) {
            console.error('Error loading orders:', error);
            res.status(500).send('Error loading orders');
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const orderId = req.params.id;
            const { status } = req.body;
            await Admin.updateOrderStatus(orderId, status);
            res.redirect('/admin/orders');
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).send('Error updating order status');
        }
    },

    // Users Management
    users: async (req, res) => {
        try {
            const users = await Admin.getAllUsers();
            res.render('admin/users', { users });
        } catch (error) {
            console.error('Error loading users:', error);
            res.status(500).send('Error loading users');
        }
    }
};

module.exports = adminController;