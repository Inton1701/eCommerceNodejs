
const user = require('../models/user_model');
const path = require('path');
const bcrypt = require('bcryptjs');


// Ariston


const users = {
  index: (req, res) => {
    res.render('index')
  },
  login: (req, res) => {

    res.render('login')
  },
  register: (req, res) => {
    res.render('register')
  },
  signup: async (req, res) => {
    const { first_name, last_name, birthdate, email, password, confirm_password } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
      return res.redirect('/register');  // Add `return` to stop further execution
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
  
    // Fetch user credentials from the database
    user.get_user_credentials(email, async (err, is_found) => {
      if (err) {
        console.log('Error fetching user credentials', err);
        return res.redirect('/login');
      }
  
      // Check if user is found
      if (!is_found) {
        console.log('User not found');
        return res.redirect('/login');
      }
  
      try {
        // Verify the password using bcrypt
        const match = await bcrypt.compare(password, is_found.password);
  
        if (match) {
          // Check if req.session is available before setting properties
          if (!req.session) {
            console.log('Session is not available');
            return res.redirect('/login');
          }
  
          // If password matches, set the session and redirect to home
          req.session.email = email;  // This should work if session is properly initialized
          res.redirect('/home');
        } else {
          // If password does not match, redirect to login
          console.log('Invalid password');
          res.redirect('/login');
        }
  
      } catch (error) {
        console.log('Error verifying password', error);
        res.redirect('/login');
      }
    });
  },
  
  shop: (req, res) => {
    if (req.session.email) {
      res.render('shop', { email: req.session.email });
    } else {
      res.redirect('/login');  // Redirect to login if session is not present
    }
  },
  
  home: (req, res) => {
    if (req.session.email) {
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
  view_product:(req, res) => {
    if (req.session.email) {
      res.render('view-product', { email: req.session.email });
    } else {
      res.redirect('/login');  // Redirect to login if session is not present
    }
  },
  cart: (req, res) => {
    if (req.session.email) {
      res.render('cart', { email: req.session.email });
    } else {
      res.redirect('/login');  // Redirect to login if session is not present
    }
  },
  checkout:
  (req, res) => {
    if (req.session.email) {
      res.render('checkout', { email: req.session.email });
    } else {
      res.redirect('/login');  // Redirect to login if session is not present
    }
  },

}

//Thiena


//Cael
module.exports = users