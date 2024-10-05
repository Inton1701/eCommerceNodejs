
const user = require('../models/user_model');
const path = require('path');
const bcrypt = require('bcryptjs');

const order = require('../models/order_model');
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
      res.render('shop', { email: req.session.email, role: req.session.role });
    } else {
      res.redirect('/login');  
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
      res.redirect('/login');
    });
  },
  // Go to selected product
  view_product: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      res.render('view-product', { email: req.session.email, role: req.session.role });
    } else {
      res.redirect('/login'); nt
    }
  },
  // Go to product
  cart: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      const userId = req.session.userId;
      order.getTotalCartValue(userId, (err, cart) => {
          if (err) throw err;
          res.render('cart', { email: req.session.email, role: req.session.role, cart: cart || { total_cart_value: 0 } }); // Provide a fallback object // Use 'cart' here
      });
    } else {
        res.redirect('/login');
    }
},

checkout: (req, res) => {
  if (req.session.email && req.session.role === 'customer') {
      const userId = req.session.userId;
      order.getTotalCartValue(userId, (err, cart) => {
          if (err) throw err;
          res.render('checkout', {
              email: req.session.email,
              role: req.session.role,
              cart: cart || [] // Ensure cart is an empty array if no items
          });
      });
  } else {
      res.redirect('/login');
  }
},

  admin: (req, res) => {
    if (req.session.email && req.session.role === 'admin') {
      res.render('admin', { email: req.session.email, role: req.session.role });
    } else {
      res.redirect('/login');  // Redirect to login if session is not present
    }
  }

}

//Thiena


//Cael
module.exports = users