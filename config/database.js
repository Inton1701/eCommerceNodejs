const mysql = require('mysql2');

const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce_db'
});
db. connect((err) => {
    if(err) throw err;
    console.log('Connected to MySQL server');
});
module.exports = db;