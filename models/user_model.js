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
              return callback(err, null);  
            }
        
            if (result.length > 0) {
              return callback(null, result[0]);  
            } else {
              return callback(null, null); 
        }    })
    },

    //Thiena


    //Cael
}




module.exports = user