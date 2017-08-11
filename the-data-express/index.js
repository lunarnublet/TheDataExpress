var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var path = require('path');

var routesController = require('./controllers/routes.js');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

var router = express.Router();

router.get('/', routesController.home);

app.use('/', router);

app.listen(3000);