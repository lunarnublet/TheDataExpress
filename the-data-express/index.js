var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/data');
mongoose.Promise = require('bluebird');

var path = require('path');

var config = require("./config.json");
var cookies = require("./util/cookie.js");

var homeController = require('./controllers/home.js');
var adminController = require('./controllers/admin.js');

var app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(cookieParser());
app.use(expressSession({
    secret: 'the-data-express',
    saveUninitialized: true,
    resave: true
}));
app.use(express.static(path.join(__dirname + '/public')));

var router = express.Router();
router.get('/', homeController.home);
router.get('/admin', authenticate, adminController.control);

app.use('/', router);

app.listen(3000);