const db = require('../config/database');

const user = {

    // Ariston
    create_user: (user_data, callback) => {
        const query = `INSERT INTO users (first_name, last_name,email, password,  birthdate) VALUES (?, ?, ?, ?, ?)`;
        const { first_name, last_name, email, password, birthdate } = user_data;
        db.query(query, [first_name, last_name, email, password, birthdate], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    get_user_credentials: (email,callback) => {
        const query = `select * from users where email=?`;
        db.query(query, [email], (err, result) => {
            if (err) {
              return callback(err, null);  // Pass error back to controller
            }
        
            if (result.length > 0) {
              return callback(null, result[0]);  // Pass user data (first row) back to controller
            } else {
              return callback(null, null);  // No user found, return null
        }    })
    },

    //Thiena


    //Cael
}




module.exports = user