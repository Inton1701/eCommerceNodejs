const db = require('../config/database');

const order = {
// Ariston
    getTotalCartValue:(userId, callback)=>{
        const query =  'SELECT p.name AS product_name, p.price, c.quantity, (p.price * c.quantity) AS product_total,SUM(p.price * c.quantity) AS total_cart_value FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ? GROUP BY p.product_id, p.name, p.price, c.quantity'
        db.query(query, [userId], (err, cart)=>{
            if(err) return callback(err);
            callback(null, cart[0]);
        })
    }
//Thiena


//Cael
}



module.exports = order