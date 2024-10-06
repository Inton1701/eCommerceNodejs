const { createPool } = require('mysql2/promise');
const db = require('../config/database');


const cart = {
// Ariston
addItemToCart: (userId, productId, callback) => {

    const checkQuery = `SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?`;
    
    db.query(checkQuery, [userId, productId], (err, results) => {
        if (err) return callback(err);
        
        if (results.length > 0) {
            // Product exists, so update the quantity
            const updateQuery = `UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?`;
            db.query(updateQuery, [userId, productId], (err) => {
                if (err) return callback(err);
                callback(null); 
            });
        } else {
            // Product does not exist, insert a new record
            const insertQuery = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?)`;
            db.query(insertQuery, [userId, productId, 1], (err) => {
                if (err) return callback(err);
                callback(null); 
            });
        }
    });
},
getCount: (userId,callback)=>{
    const query = 'SELECT COUNT(*) as count FROM cart WHERE user_id =?'
    db.query(query, [userId], (err, result) => {
        if (err) return callback(err);
        callback(null, result[0].count);
    })
},
updateCart: (qty, userId, id, callback) => {
    console.log('Updating cart with:', { qty, userId, id });
    const query = `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`;
    db.query(query, [qty, userId, id], (err, result) => {
        if (err) return callback(err);
        console.log('Update result:', result);
        callback(null, result);
    });
},
deleteCart: (cartId, callback) => {
     const query = 'DELETE FROM cart WHERE cart_id =?';
     db.query(query, [cartId], (err, result) => {
         if (err) return callback(err);
         callback(null, result);
     });
}


//Cael
}
module.exports = cart;