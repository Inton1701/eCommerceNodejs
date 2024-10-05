const Admin = require('../models/admin_model');
//cael
const adminController = {
    dashboard: (req, res) => {

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
//Ariston
    // Products Management
    products: (req, res) => {
        try {
            const products = Admin.getAllProducts();
            const categories = Admin.getAllCategories();
            res.render('admin/products', { products, categories });
        } catch (error) {
            console.error('Error loading products:', error);
            res.status(500).send('Error loading products');
        }
    },



    // Orders Management
    orders: (req, res) => {
        try {
            const orders = Admin.getAllOrders();
            res.render('admin/orders', { orders });
        } catch (error) {
            console.error('Error loading orders:', error);
            res.status(500).send('Error loading orders');
        }
    },

    // Users Management
    users: (req, res) => {

        Admin.getAllUsers((err, users) => {
            if (err) {
                console.error('Error loading users:', error);
                return res.status(500).send('Error loading users');
            }
            const formattedUsers = users.map(user => {
                const birthdate = new Date(user.birthdate); // Assuming `birthdate` is a valid date field
                const month = String(birthdate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(birthdate.getDate()).padStart(2, '0');
                const year = String(birthdate.getFullYear()).slice(-2); // Get last two digits of year

                return {
                    ...user, // Spread the user object
                    formattedBirthdate: `${month}-${day}-${year}` // Add formatted birthdate
                };
            });

            res.render('admin-users', { users: formattedUsers });
        }
        )
    },
    update_user: (req, res) => {
        const user_id = req.body.user_id;

        const updatedData = {
            user_id: user_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            birthdate: req.body.birthdate
        };

        console.log("Updated product data:", updatedData);

        // Update product in the database
        Admin.updateUsers(user_id, updatedData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating product');
            }
            res.redirect('/admin/users');
        });
    },
    delete_user: (req, res) => {
        const user_id = req.params.user_id;

        Admin.deleteUsers(user_id, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting product');
            }
            res.redirect('/admin/users');
        })
    },


    order: (req, res) => {
        Admin.getAllOrders((err, orders) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching categories');
            }

            res.render('admin-order', { orders }); // Render your EJS view with products and categories
        })

    },

    update_order: (req, res) => {

        const orderData = {
            orderId: req.body.order_id,
            status: req.body.status
        }
        console.log(orderData);
        Admin.updateOrderStatus(orderData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating product');
            }
            res.redirect('/admin/orders');
        });
    },
    delete_orders: (req, res) => {
        const orderId = req.params.order_id;

        Admin.deleteOrders(orderId, (err) => {
            if (err) {
                if (err.message === 'Order not found') {
                    return res.status(404).send('Order not found');
                }
                console.error(err);
                return res.status(500).send('Error deleting order');
            }
            res.redirect('/admin/orders');
        });
    },

    category: (req, res) => {
        Admin.getAllCategories((err, categories) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching categories');
            }
            res.render('admin-category', { categories }); 
        })
    },
    update_category: (req,res) =>{
        const categoryData = {
            category_id: req.body.category_id,
            category_name: req.body.category_name
        }
        console.log(categoryData);
        Admin.updateCategory(categoryData, (err)=>{
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating category');
            }
            res.redirect('/admin/category');
        })
    },
    delete_category: (req, res) => {
        const category_id = req.params.category_id;
        Admin.deleteCategory(category_id, (err)=>{
            if (err) {
                if (err.message === 'Category not found') {
                    return res.status(404).send('Category not found');
                }
                console.error(err);
                return res.status(500).send('Error deleting category');
            }
            res.redirect('/admin/category');
        })
    }
};

module.exports = adminController;