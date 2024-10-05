const category = require('../models/category_model');

const categories ={
    // Ariston
    manage_category:(req,res) =>{
        res.render('manage-category');
    }
 
}
module.exports = categories;