const express = require('express')
const app = express();
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static('uploads'));

app.listen(3001)