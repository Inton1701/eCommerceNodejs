const db = require('../config/database');

const category = {
    getAll: (callback) => {
        db.query('SELECT * FROM categories', (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },
}

module.exports = category;