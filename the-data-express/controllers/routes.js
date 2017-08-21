var config = require("../config.json");
var bcrypt = require('bcrypt-nodejs');
var models;

module.exports = function (repository) {
    models = repository;

    return {
        home: home,
        register: register,
        registerPost: registerPost,
        admin: admin,
        login: login,
        loginPost: loginPost,
        editUser: editUser,
        editUserPost: editUserPost,
        deleteUser: deleteUser,
    };
}

var home = function (req, res) {
    
    models.Users.find({}, function (err, users) {
        if (err) return console.error(err);
        var ans1 = [];
        var strings1 = [];
        var ans2 = [];
        var strings2 = [];
        var ans3 = [];
        var strings3 = [];
        var letters = ["A", "B", "C", "D"];
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
        for (var i = 0; i < ans2.length; ++i) {
            ans2[i] = (ans2[i] / users.length) * 100;
        }
        for (var i = 0; i < ans3.length; ++i) {
            ans3[i] = (ans3[i] / users.length) * 100;
        }
        models.Questions.find({}, function (err, questions) {
            if (err) return console.error(err);
            res.render("index", {
                config: config, 
                ans1: ans1, 
                ans2: ans2, 
                ans3: ans3, 
                answerNames1: strings1, 
                answerNames2: strings2, 
                answerNames3: strings3,
                questions: questions,
                userSession: req.session.user,
                time: req.cookies.time,
            });
        });
    });
}

var register = function (req, res) {
    res.render("register", {
        config: config,
        time: req.cookies.time,
        questions: config.questions,
    });
}
var registerPost = function (req, res) {
    if (!req.body.userName ||
        !req.body.password ||
        !req.body.email ||
        !req.body.age ||
        !req.body.answer1 ||
        !req.body.answer2 ||
        !req.body.answer3) {
            res.redirect('/register');
        } else {
            
        var info = {
            username: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            age: req.body.age,
            answer1: req.body.answer1,
            answer2: req.body.answer2,
            answer3: req.body.answer3,
            role: 'user',
        };
        var query = models.Users.find({ username: req.body.userName });
        query.exec().then(function (users) {
            if (users.length) {
                // name taken
                res.redirect("/register");
            } else {
                models.registerUser(info, function() {
                    models.tryLoginUser(info.username, info.password, function (user) {
                        if (user) {
                            req.session.user = user;
                            delete req.session.user.password;
                            res.redirect('/');
                        } else {
                            res.redirect('/login');
                        }
                    });
                });
            }
        });
    }

    
}
var login = function (req, res) {
    res.render("login", {
        config: config,
        time: req.cookies.time,
    });
}
var loginPost = function (req, res, next) {
    models.tryLoginUser(req.body.userName, req.body.password, function (user) {
        console.log("login:POST\n", user);

        if (user) {
            req.session.user = user;
            delete req.session.user.password;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
}

var admin = function (req, res) {
    var query = models.Users.find({});
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

var deleteUser = function (req, res, next) {
    var userId = req.params.id;

    var query = models.Users.findOneAndRemove({ _id: userId });
    query.exec().then(function (doc) {
        res.redirect("/admin");
    }, function (reason) {
        console.log(reason);
        res.redirect("/admin");
    });
}

var editUser = function (req, res, next) {
    var userId = req.params.id ? req.params.id : req.session.user._id;

    // only let admins or the same user edit a user's information    
    if (req.session.user.role === "admin" ||
    req.session.user._id === userId) {

        var query = models.Users.findOne({ _id: userId });
        query.exec().then(function (val) {
            models.Questions.find({}, function (err, questions) {
                if (err) return console.error(err);
                console.log("editUser:GET\n", val);
                res.render("edit", {
                    userToEdit: val,
                    userSession: req.session.user,
                    time: req.cookies.time,            
                    config: config,
                    questions: questions
                });
            });
        }, function (reason) {
            console.log(reason);
            res.sendStatus(400);
        });
    } else {
        res.sendStatus(403);
    }
}
var editUserPost = function (req, res, next) {
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

        models.editUser(userId, info, function (user) {
            if (req.session.user._id === userId) {
                req.session.user.role = user.role;
            }
            console.log("editUser:POST\n", user);
            res.redirect('/');
        });
    } else {
        res.sendStatus(403);
    }
}
