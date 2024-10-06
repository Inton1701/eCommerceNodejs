const db = require('../config/database');

const order = {
// Ariston
    getTotalCartValue:(userId, callback)=>{
        const query =  'SELECT p.product_id, p.name AS product_name, p.price, c.quantity, (p.price * c.quantity) AS product_total,SUM(p.price * c.quantity) AS total_cart_value FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ? GROUP BY p.product_id, p.name, p.price, c.quantity'
        db.query(query, [userId], (err, cart)=>{
            if(err) return callback(err);
            callback(null, cart[0]);
        })
    },
    getCartItem: (userId, callback) => {
        const query = `SELECT p.product_id, p.name AS product_name, p.image_path AS image, p.price, c.quantity, c.cart_id, (p.price * c.quantity) AS product_total 
                       FROM cart c 
                       JOIN products p ON c.product_id = p.product_id 
                       WHERE c.user_id = ?`; 
        db.query(query, [userId], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },
    placeOrder: (userId, orderData) => {
        return new Promise((resolve, reject) => {
            const query1 = `INSERT INTO orders (user_id, total_price, payment_method) VALUES (?,?,?)`;
            const query2 = `INSERT INTO ordered_items (order_id, product_id, quantity, price) VALUES(?,?,?,?)`;
            

            db.query(query1, [userId, orderData.total_price, orderData.paymethod], (err, result) => {
                if (err) return reject(err);
                
                const orderId = result.insertId; 
    
            
                const itemPromises = orderData.items.map(item => {
                    return new Promise((resolveItem, rejectItem) => {
                        db.query(query2, [orderId, item.product_id, item.quantity, item.price], (err, result) => {
                            if (err) return rejectItem(err); 
                            resolveItem(result);
                        });
                    });
                });
    
          
                Promise.all(itemPromises)
                    .then(results => resolve(results)) 
                    .catch(err => reject(err)); 
            });
        });
    }
//Thiena


//Cael
}



module.exports = order