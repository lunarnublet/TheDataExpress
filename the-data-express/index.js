var express = require('express'),
pug = require('pug'),
path = require('path'),
bodyParser = require('body-parser'),
cookieParser = require('cookie-parser'),
expressSession = require('express-session'),
mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/data');
var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var config = require("./config.json");
var sessions = require("./util/session");
var models = require('./repository/models')(mongoose);
var repository = require('./repository/repository')(models);

var routesController = require('./controllers/routes')(repository);

var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(cookieParser());
app.use(expressSession({
    name: 'tde',
    secret: 'the-data-express',
    saveUninitialized: true,
    resave: true,
}));
app.use(express.static(path.join(__dirname + '/public')));

var router = express.Router();
router.get('/', sessions.saveCurrentTime, routesController.home);
router.get('/login', sessions.saveCurrentTime, routesController.login);
router.get('/logout', sessions.authenticate(), sessions.destroyUserSession, routesController.home);
router.get('/admin', sessions.authenticate("admin"), sessions.saveCurrentTime, routesController.admin);
router.get('/edit', sessions.authenticate(), sessions.saveCurrentTime, routesController.editUser);
router.get('/edit/:id', sessions.authenticate(), sessions.saveCurrentTime, routesController.editUser);
router.post('/login', urlencodedParser, sessions.saveCurrentTime, routesController.loginPost);
router.post('/edit', sessions.authenticate(), urlencodedParser, sessions.saveCurrentTime, routesController.editUserPost);

app.use('/', router);

app.post('/questions', urlencodedParser, function (req, res) {
    console.log(req.body.userName);  
    res.render('landing', req.body);
});

app.listen(3000);
