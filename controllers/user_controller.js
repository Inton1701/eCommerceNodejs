
const user = require('../models/user_model');
const path = require('path');
const bcrypt = require('bcryptjs');


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

      // Prepare user data with the hashed password
      const user_data = {
        first_name,
        last_name,
        birthdate,
        email,
        password: hashedPassword
      };

      console.log(user_data);

      //   Save user data to the database (uncomment when needed)
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
    const admin_email = 'admin@nodejs.com';
    const admin_password = 'admin';

    // Fetch user credentials from the database
    user.get_user_credentials(email, async (err, is_found) => {
      if (err) {
        console.log('Error fetching user credentials:', err);
        return res.redirect('/login');
      }

      // Admin login check
      if (email === admin_email) {
        if (password === admin_password) {
          req.session.email = email;
          req.session.role = 'admin';
          return res.redirect('/admin'); // Ensure return after redirect
        } else {
          console.log('Invalid admin password');
          return res.redirect('/login');
        }
      }

      // Non-admin user check
     else if (!is_found) {
        console.log('User not found');
        return res.redirect('/login');
      }

      try {
        // Verify the password using bcryptjs
        const match = await bcrypt.compare(password, is_found.password);

        if (match) {
          // If password matches, set the session and redirect to home
          req.session.email = email;
          req.session.role = is_found.role;
          return res.redirect('/home'); // Ensure return after redirect
        } else {
          console.log('Invalid password');
          return res.redirect('/login'); // Ensure return after redirect
        }
      } catch (error) {
        console.log('Error verifying password:', error);
        return res.redirect('/login');
      }
    });
},

  shop: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      res.render('shop', { email: req.session.email, role: req.session.role });
    } else {
      res.redirect('/login');  // Redirect to login if session is not present
    }
  },

  home: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      res.render('home', { email: req.session.email });
    } else {
      res.redirect('/login');  // Redirect to login if session is not present
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session', err);
      }
      res.redirect('/login');
    });
  },

  view_product: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      res.render('view-product', { email: req.session.email, role: req.session.role });
    } else {
      res.redirect('/login'); nt
    }
  },

  cart: (req, res) => {
    if (req.session.email && req.session.role === 'customer') {
      res.render('cart', { email: req.session.email, role: req.session.role });
    } else {
      res.redirect('/login');
    }
  },

  checkout:
    (req, res) => {
      if (req.session.email && req.session.role === 'customer') {
        res.render('checkout', { email: req.session.email, role: req.session.role });
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