
const user = require('../models/user_model');
const path = require('path');
const bcrypt = require('bcryptjs');
const product = require('../models/product_model');
const order = require('../models/order_model');
const cart = require('../models/cart_model');
// Ariston


const users = {
  // Go to index
  index: (req, res) => {
    res.render('index')
  },
  // Go to login
  login: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session', err);
      }
    })
    res.render('login')
  },
  // Go to register
  register: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session', err);
      }
    })
    res.render('register')
  },
  // Insert credetials to useir table
  signup: async (req, res) => {
    const { first_name, last_name, birthdate, email, password, confirm_password } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
      return res.redirect('/register');
    }

    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Pass the data to the user_data array
      const user_data = {
        first_name,
        last_name,
        birthdate,
        email,
        password: hashedPassword
      };

      console.log(user_data);

      //   Save user data to the table of users
      user.create_user(user_data, (err) => {
        if (err) throw err;
        res.redirect('/login');
      });

    } catch (err) {
      console.error('Error hashing password', err);
      res.redirect('/register');
    }
  }
  ,
  authenticate: async (req, res) => {
    const { email, password } = req.body;
    // Temporary admin credentials only for testing purposes lang ba 
    const admin_email = 'admin@nodejs.com';
    const admin_password = 'admin';

    // get user credentials from the database
    user.get_user_credentials(email, async (err, is_found) => {
      if (err) {
        console.log('Error fetching user credentials:', err);
        return res.redirect('/login');
      }

      // Check if the user role is admin
      if (email === admin_email) {
        if (password === admin_password) {
          req.session.email = email;
          req.session.role = 'admin';
          return res.redirect('/admin/dashboard');
        } else {
          console.log('Invalid admin password');
          return res.redirect('/login');
        }
      }

      // Else check if the user role is customer
      else if (!is_found) {
        console.log('User not found');
        return res.redirect('/login');
      }

      try {
        // Verify the password 
        const match = await bcrypt.compare(password, is_found.password);

        if (match) {
          // If password matches, set the session and redirect to home
          req.session.email = email;
          req.session.role = is_found.role;
          req.session.userId = is_found.user_id;
          console.log("id: " + req.session.userId)
          return res.redirect('/home');
        } else {
          console.log('Invalid password');
          return res.redirect('/login');
        }
      } catch (error) {
        console.log('Error verifying password:', error);
        return res.redirect('/login');
      }
    });
  },



  // Go to shop
  shop: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      console.log("Fetching products..."); // Add this log
      product.getAllProducts((err, products) => {
        if (err) {
          console.error('Error fetching products:', err);
          return res.status(500).send('Internal Server Error');
        }

        console.log("Products fetched:", products);

        res.render('shop', { email: req.session.email, role: req.session.role, products: products, userId: req.session.userId });
      });
    } else {
      req.session.destroy();
      return res.redirect('/login');
    }

  },
  // Go to home
  home: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      res.render('home', { email: req.session.email });
    } else {
      res.redirect('/login');
    }
  },
  // Go to login page and destroy session
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session', err);
      }
      console.log('Session destroyed')
      res.redirect('/login');
    });
  },
  // Go to selected product
  view_product: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      res.render('view-product', { email: req.session.email, role: req.session.role });
    } else {
      res.redirect('/login');
    }
  },
  // Go to product
  cart: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
        const userId = req.session.userId;
        console.log('User ID:', userId); 
        order.getCartItem(userId, (err, cartItems) => {
            if (err) {
                console.error('Error fetching cart items:', err); 
                return res.status(500).json({ message: 'Error fetching cart items' });
            }
            order.getTotalCartValue(userId, (err, total) => {
                if (err) {
                    console.error('Error fetching total cart value:', err); 
                    return res.status(500).json({ message: 'Error fetching total cart value' });
                }
                console.log('Total Cart Value:', total);

                const totalCartValue = total && total.total_cart_value ? Number(total.total_cart_value) : 0;

                const cart = {
                    items: cartItems,
                    total_cart_value: totalCartValue
                };

        
                res.render('cart', {
                    email: req.session.email,
                    role: req.session.role,
                    userid: userId,
                    cart: cart.items,
                    total: cart.total_cart_value, 
                });
            });
        });
    } else {
        res.redirect('/login');
    }
},
// load check out page
checkout: (req, res) => {
  if (req.session.email && req.session.role === 'customer') {
      const userId = req.session.userId;
      console.log('User ID:', userId); 
      order.getCartItem(userId, (err, cartItems) => {
          if (err) {
              console.error('Error fetching cart items:', err); 
              return res.status(500).json({ message: 'Error fetching cart items' });
          }
          order.getTotalCartValue(userId, (err, total) => {
              if (err) {
                  console.error('Error fetching total cart value:', err);
                  return res.status(500).json({ message: 'Error fetching total cart value' });
              }
              console.log('Total Cart Value:', total);

              const totalCartValue = total && total.total_cart_value ? Number(total.total_cart_value) : 0;

              const cart = {
                  items: cartItems,
                  total_cart_value: totalCartValue 
              };

              res.render('checkout', {
                  email: req.session.email,
                  role: req.session.role,
                  userid: userId,
                  cart: cart.items,
                  total: cart.total_cart_value, 
              });
          });
      });
  } else {
      res.redirect('/login');
  }
},
// load admin
  admin: (req, res) => {
    if (req.session.email && req.session.role === 'admin') {
      res.render('admin', { email: req.session.email, role: req.session.role });
    } else {
      res.redirect('/login');
    }
  },
  // place order
  placeOrders: (req, res) => {
    const userId = req.body.userid; 
    const paymentMethod = req.body.payment_method;
    const productIds = req.body.product_id || []; 
    const quantities = req.body.quantity || []; 
    const prices = req.body.price || []; 


    if (!userId || productIds.length === 0 || quantities.length === 0 || prices.length === 0) {
      console.log(userId, productIds,prices, quantities)
        return res.status(400).json({ message: 'Invalid order data' });
    }

    const orderData = {
        total_price: parseFloat(req.body.total) || 0,
        paymethod: paymentMethod,
        items: productIds.map((id, index) => ({
            product_id: id,
            quantity: quantities[index] || 0,
            price: prices[index] || 0, 
        })),
    };

    order.placeOrder(userId, orderData)
        .then(result => {
            return res.render('thank-you', {payment: orderData.paymethod, amount:orderData.total_price}); 
        })
        .catch(err => {
            console.error('Error placing order:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        });
},
// load when the order is successfull
thankYou: (req, res) => {
  if (req.session.email && req.session.role === 'customer') {
    res.render('thank-you')
  }else{
    res.redirect('/login');
  }

}
}


//Thiena


//Cael
module.exports = users