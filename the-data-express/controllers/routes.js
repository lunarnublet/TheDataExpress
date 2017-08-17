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

exports.home = function (req, res) {
    seedDatabase();
    User.find("username", function (err, users) {
        if (err) return console.error(err);
        var ans1 = [];
        var strings1 = [];
        var ans2 = [];
        var strings2 = [];
        var ans3 = [];
        var strings3 = [];
        for (var i = 0; i < users.length; ++i) {
            var v = 0;
            var isAThing1 = false;
            while (v < strings1.length) {
                if (strings1[v] == users[i].answer1) {
                    isAThing1 = true;
                    break;
                }
                ++v;
            }
            if (isAThing1) {
                ++ans1[v];
            }
            else {
                strings1.push(users[i].answer1);
                ans1.push(1);
            }

            var v = 0;
            var isAThing2 = false;
            while (v < strings2.length) {
                if (strings2[v] == users[i].answer2) {
                    isAThing2 = true;
                    break;
                }
                ++v;
            }
            if (isAThing2) {
                ++ans2[v];
            }
            else {
                strings2.push(users[i].answer2);
                ans2.push(1);
            }

            var v = 0;
            var isAThing3 = false;
            while (v < strings3.length) {
                if (strings3[v] == users[i].answer3) {
                    isAThing3 = true;
                    break;
                }
                ++v;
            }
            if (isAThing3) {
                ++ans3[v];
            }
            else {
                strings3.push(users[i].answer3);
                ans3.push(1);
            }
        }
        for (var i = 0; i < ans1.length; ++i) {
            ans1[i] = (ans1[i] / users.length) * 100;
        }
        for (var i = 0; i < ans1.length; ++i) {
            ans2[i] = (ans2[i] / users.length) * 100;
        }
        for (var i = 0; i < ans1.length; ++i) {
            ans3[i] = (ans3[i] / users.length) * 100;
        }
        res.render("index", {
            config: config, ans1: ans1, ans2: ans2, ans3: ans3, answerNames1: strings1, answerNames2: strings2, answerNames3: strings3,
            userSession: req.session.user,
            time: req.cookies.time,                            
        });
    });
}
function deleteAllUsers() {
    console.log("DELETEALLUSERS()");
    // var allUsers = User.find({});
    // allUsers.exec().then(function (doc) {
    //     doc.forEach(function(user) {
    //       console.log("found user", user);  
    //     });
    // });
    var users = User.find({});
    users.exec().then(function (doc) {
        if (doc) {
            doc.forEach(function (user) {
                var remove = User.remove(user);
                remove.exec().then(function (res) {
                    console.log("  Deleted user: " + user.username);
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
        user.save(function (err, user) {
            if (err) return false;
            return true;
        });
    });
}

function seedDatabase() {
    var query = User.findOne({ username: "admin" });
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
        registerUser(admin);
        for (var i = 1; i < 11; ++i) {
            var user = {
                username: "user" + i,
                password: "pass",
                age: 25,
                email: "user" + i + "@express.com",
                role: "user",
                answer1: Math.floor((Math.random() * 4) + 1),
                answer2: Math.floor((Math.random() * 4) + 1),
                answer3: Math.floor((Math.random() * 4) + 1)
            };
            registerUser(user);
            // user.save(function (err, user) {
            //     if (err) return console.error(err);
            //     console.log(user.username + ' added');
            //   });
        }
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
exports.loginPost = function (req, res, next) {
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
                        res.redirect('/');
                    } else {
                        res.redirect('/login');
                    }
                }
            });
        }
    });
}

exports.admin = function (req, res) {
    var query = User.find({});
    query.exec().then(function (doc) {
        if (doc) {
            res.render('admin', {
                config: config,
                users: doc,
                time: req.cookies.time,
                userSession: req.session.user
            });
        } else {
            res.sendStatus(500);
        }
    });
}

exports.deleteUser = function (req, res, next) {
    var userId = req.query.id;

    var query = User.findOneAndRemove({ _id: userId });
    query.exec().then(function (doc) {
        res.redirect("/admin");
    }, function (reason) {
        res.redirect("/admin");
    });
}

exports.editUser = function (req, res, next) {
    var userId = req.params.id ? req.params.id : req.session.user._id;
    
    // only let admins or the same user edit a user's information    
    if (req.session.user.role === "admin" ||
        req.session.user._id === userId) {

        var query = User.findOne({ _id: userId });
        query.exec().then(function (val) {
            res.render("edit", {
                userToEdit: val,
                userSession: req.session.user,
                time: req.cookies.time,            
                config: config
            });
        }, function (reason) {
            console.log(reason);
            res.sendStatus(400);
        });
    } else {
        res.sendStatus(403);
    }
}
exports.editUserPost = function (req, res, next) {
    var userId = req.body.id;

    // only let admins or the same user edit a user's information
    if (req.session.user.role === "admin" ||
        req.session.user._id === userId) {

        var info = { id: userId };
        if (req.body.email) info.email = req.body.email;
        if (req.body.age) info.age = req.body.age;
        if (req.body.role) info.role = req.body.role;
        if (req.body.password) info.password = req.body.password;
        if (req.body.answer1) info.answer1 = req.body.answer1;
        if (req.body.answer2) info.answer2 = req.body.answer2;
        if (req.body.answer3) info.answer3 = req.body.answer3;

        if (info.password) {
            bcrypt.hash(info.password, null, null, function (err, hashed) {
                if (err) {
                    console.log(err);
                } else {
                    info.password = hashed;
                    var query = User.findOneAndUpdate({ _id: userId }, info);
                    query.exec().then(function (val) {
                        req.session.user.role = info.role ? info.role : req.session.user.role;
                        res.render("edit", {
                            userToEdit: info,
                            user: req.session.user,
                            time: req.cookies.time,                
                            config: config
                        });
                    });
                }
            });
        } else {
            var query = User.findOneAndUpdate({ _id: userId }, info);
            query.exec().then(function (val) {
                req.session.user.role = info.role ? info.role : req.session.user.role;
                res.render("edit", {
                    userToEdit: info,
                    userSession: req.session.user,
                    time: req.cookies.time,                                    
                    config: config
                });
            });
        }
    } else {
        res.sendStatus(403);
    }

}
