var config = require("../config.json");
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var expressSession = require('express-session');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/data');

var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {

});

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    age: String,
    email: String,
    role: String,
    answer1: String,
    answer2: String,
    answer3: String
});

var User = mongoose.model('User_Accounts', userSchema);

function checkUsers() {
    console.log("CHECKUSERS()");
    var allUsers = User.find({});
    allUsers.exec().then(function (doc) {
        doc.forEach(function(user) {
          console.log("found user", user);  
        });
    });
    var testusers = User.find({username: "TestUser"});
    testusers.exec().then(function (doc) {
        if (doc) {
            doc.forEach(function (user) {
                var remove = User.remove(user);
                remove.exec().then(function (res) {
                    console.log("Deleted a TestUser");
                })
            });
        }
    });
}

// do this after all validation checks
// data must have a non-hashed password
function registerUser(data) {
    bcrypt.hash(data.password, null, null, function (err, hashedPass) {
        if (err) return false;

        var user = new User({
            username: data.username,
            password: hashedPass,
            role: data.role,
            email: data.email,
            age: data.age,
            answer1: data.answer1,
            answer2: data.answer2,
            answer3: data.answer3
        });
        console.log("registerUser", user);
        user.save(function (err, user) {
            if (err) return false;
            return true;
        });
    });
}

function seedDatabase() {
    var query = User.findOne({username: "admin" });
    query.exec().then(function (doc) {
        if (doc) {
            return;
        }

        var admin = {
            username: "admin",
            password: "pass",
            role: "admin",
            email: "admin@express.com",
            age: 28,
            answer1: "3",
            answer2: "2",
            answer3: "1",
        };
        var user1 = {
            username: "user1",
            password: "pass",
            role: "user",        
            email: "user1@express.com",
            age: 25,
            answer1: "1",
            answer2: "1",
            answer3: "2",
        };
        var user2 = {
            username: "user2",
            password: "pass",
            role: "user",                
            email: "user2@express.com",
            age: 20,
            answer1: "1",
            answer2: "1",
            answer3: "1",
        };
        var user3 = {
            username: "user3",
            password: "pass",
            role: "user",                
            email: "user3@express.com",
            age: 32,
            answer1: "2",
            answer2: "1",
            answer3: "3",
        };
    
        registerUser(admin);
        registerUser(user1);
        registerUser(user2);
        registerUser(user3);
    });
}

exports.home = function (req, res) {
    seedDatabase();
    checkUsers();
    res.render("index", {
        config: config,
        title: "The Data Express",
    });
}

exports.register = function (req, res) {
    res.render("register", { config: config, title: "Register" });
}
exports.registerPost = function (req, res) {
    var query = User.find({ username: req.body.userName });
    query.exec().then(function (users) {
        if (users.length) {
            // name taken
            res.redirect("/login");
        }

        res.redirect("/login");            
    });
}

exports.login = function (req, res) {
    res.render("login", {
        config: config,
        title: "Login Page",
    });
}
exports.loginPost = function (req, res) {
    User.findOne({ username: req.body.userName }, function (err, user) {
        if (err) {
            console.log('User.findOne failed');
            res.redirect('/login');
        }
        else {
            console.log(user);
            bcrypt.compare(req.body.password, user.password, function (err, isValidPassword) {
                if (err) {
                    console.log('bcrypt.Compare failed');
                    res.redirect('/login');
                }
                else {
                    if (isValidPassword) {
                        req.session.user = user;
                        delete req.session.user.password;
                    } else {
                        res.redirect('/login');
                    }
                }
            });
        }
    });
}

exports.admin = function (req, res) {
    var users = [
        { id: 1, username: 'foo', email: 'foo@gmail.com', age: 322 },
        { id: 2, username: 'bar', email: 'bar@gmail.com', age: 232 },
        { id: 3, username: 'baz', email: 'baz@gmail.com', age: 223 },
    ];

    res.render('admin', { config: config, users: users, time: req.cookies.time });
}
