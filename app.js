const express = require('express')
const app = express();
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(session({
    secret: 'dikoalam',  // Replace with a strong secret
    resave: false,
    saveUninitialized: true,  // Ensure uninitialized sessions are saved
    cookie: { secure: false }  // Set to true if using HTTPS
  }));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap-icons', express.static(__dirname + '/node_modules/bootstrap-icons/font'));
app.set('views', path.join(__dirname, 'views'));


app.listen(3001)