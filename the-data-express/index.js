var express = require('express');

var homeController = require('./controllers/index.js');

var app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));

var router = express.Router();

router.get('/', homeController.home);

app.listen(3000);