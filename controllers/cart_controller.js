const cart = require('../models/cart_model');
const product = require('../models/product_model');

const carts = {
// Ariston

addCart: (req, res) => {
    if(req.session.email && req.session.role === 'customer') {
        const productId = req.params.id;
        const userId = req.session.userId;

        cart.addItemToCart(userId, productId, (err) => {
            if (err) {
                console.error('Error adding item to cart:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            return res.status(200).json({ message: 'Item added to cart successfully' });
        });
    } else {
        req.session.destroy();
        return res.redirect('/login');
    }
},
getCartCount:(req,res)=>{
    if(req.session.email && req.session.role === 'customer') {
        const userId = req.session.userId;
        cart.getCount(userId,(err, count) =>{
            if(err) {
                console.error('Error getting cart count:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.json({count: count});
        })
}else{
    res.json({count: 0});
}},
updateCart: async (req, res) => {
    const {userid, product_id, quantity } = req.body;
    if (!req.session.email || req.session.role!== 'customer' || !req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!product_id || product_id.length === 0 || !quantity || quantity.length === 0 || product_id.length !== quantity.length ) {
        return res.status(400).json({ message: 'missing' });
    }

    try {
        const updatePromises = product_id.map((id, index) => {
            const qty = quantity[index];
            return new Promise((resolve, reject) => {
                cart.updateCart(qty, userid, id, (err, result) => {
                    if (err) {
                        reject(err);
                    } else if (result.affectedRows === 0) {
                        reject(new Error('Product not found in cart'));
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        await Promise.all(updatePromises);
        return res.redirect('/cart')

    } catch (err) {
        console.error('Error updating cart:', err);
        if (err.message === 'Product not found in cart') {
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
},
deleteCart:(req, res) => {
    const cartId = req.params.cart_id;
    if (!req.session.email || req.session.role!== 'customer' ||!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    cart.deleteCart(cartId, (err) => {
        if (err) {
            console.error('Error deleting cart:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.redirect('/cart')
    })
}


//Cael
}

module.exports = carts;