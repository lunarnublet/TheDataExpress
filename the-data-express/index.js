var express = require('express'),
    mongoose = require('mongoose'),
    pug = require('pug'),
    path = require('path'),
    bodyParser = require('body-parser');
mongoose.Promise = require('bluebird');

var path = require('path');

var routesController = require('./controllers/routes.js');

var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

var router = express.Router();

router.get('/', routesController.home);

app.use('/', router);

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', urlencodedParser, function (req, res) {
    console.log(req.body.userName);  
    res.render('landing', req.body);
});

app.listen(3000);
