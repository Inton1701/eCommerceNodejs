
const user = require('../models/user_model');
const path = require('path');
const bcrypt = require('bcryptjs');

// Ariston


const users = {
    index: (req, res) =>{
        res.render('index')
    },
    login: (req, res) =>{
        
        res.render('login')
    },
    register: (req, res) =>{
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
            return res.redirect('/login');  // Handle error and stop further execution
          }
      
          // Check if user is found
          if (is_found) {
            try {
              // Verify the password using bcrypt
              const match = await bcrypt.compare(password, is_found.password);
      
              // If the password matches, redirect to home, otherwise back to login
              if (match) {
                res.render('home');
              } else {
                console.log('wverifying password', error);
              }
      
            } catch (error) {
              console.log('Error verifying password', error);

            }
          } else {
            console.log('User not found');
          }
        });
      }
      
}

//Thiena


//Cael
module.exports = users