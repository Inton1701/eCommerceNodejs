const Admin = require('../models/admin_model');
//cael
const adminController = {
    dashboard:   (req, res) => {
   
            Admin.getDashboardData((error, dashboardData) => {
                if (error) {
                    console.error('Error loading dashboard:', error);
                    return res.status(500).send('Error loading dashboard');
                }
    
                Admin.getRecentOrders((error, recentOrders) => {
                    if (error) {
                        console.error('Error loading recent orders:', error);
                        return res.status(500).send('Error loading recent orders');
                    }
    
                    Admin.getTopProducts((error, topProducts) => {
                        if (error) {
                            console.error('Error loading top products:', error);
                            return res.status(500).send('Error loading top products');
                        }
    
                        Admin.getCategoryDistribution((error, categories) => {
                            if (error) {
                                console.error('Error loading category distribution:', error);
                                return res.status(500).send('Error loading category distribution');
                            }
    
                            res.render('admin-dashboard', {
                                ...dashboardData,
                                recentOrders,
                                topProducts,
                                categories
                            });
                        });
                    });
                });
            });
        
    },

    // Products Management
    products:   (req, res) => {
        try {
            const products =   Admin.getAllProducts();
            const categories =   Admin.getAllCategories();
            res.render('admin/products', { products, categories });
        } catch (error) {
            console.error('Error loading products:', error);
            res.status(500).send('Error loading products');
        }
    },

    addProduct:   (req, res) => {
        try {
            const productData = req.body;
              Admin.addProduct(productData);
            res.redirect('/admin/products');
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).send('Error adding product');
        }
    },

    editProduct:   (req, res) => {
        try {
            const productId = req.params.id;
            const productData = req.body;
              Admin.updateProduct(productId, productData);
            res.redirect('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).send('Error updating product');
        }
    },

    deleteProduct:   (req, res) => {
        try {
            const productId = req.params.id;
              Admin.deleteProduct(productId);
            res.redirect('/admin/products');
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).send('Error deleting product');
        }
    },

    // Orders Management
    orders:   (req, res) => {
        try {
            const orders =   Admin.getAllOrders();
            res.render('admin/orders', { orders });
        } catch (error) {
            console.error('Error loading orders:', error);
            res.status(500).send('Error loading orders');
        }
    },

    updateOrderStatus:   (req, res) => {
        try {
            const orderId = req.params.id;
            const { status } = req.body;
              Admin.updateOrderStatus(orderId, status);
            res.redirect('/admin/orders');
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).send('Error updating order status');
        }
    },

    // Users Management
    users:   (req, res) => {
        try {
            const users =   Admin.getAllUsers();
            res.render('admin/users', { users });
        } catch (error) {
            console.error('Error loading users:', error);
            res.status(500).send('Error loading users');
        }
    }
};

module.exports = adminController;