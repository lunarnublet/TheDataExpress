var bcrypt = require('bcrypt-nodejs');
var models;
module.exports = function(mongooseModels) {
    models = mongooseModels;
    // deleteAllUsers();
    seedDatabase();

    models.tryLoginUser = tryLoginUser;
    models.registerUser = registerUser;
    models.editUser = editUser;
    models.getQuestions = getQuestions;

    return models;
}
var editUser = function(id, info, callback) {
    if (info.password) {
        info.password = bcrypt.hashSync(info.password, null);
    }
    var query = models.Users.findOneAndUpdate({ _id: id }, info);
    query.exec().then(function (val) {
        callback(info);                
    }, function(err) {
        console.log(err);
    });
}

var tryLoginUser = function(userName, password, callback) {
    var query = models.Users.findOne({ username: userName });
    
    query.exec().then(function(user){
        if (user) {
            var isValidPassword = bcrypt.compareSync(password, user.password);
            console.log("valid password", isValidPassword);
            isValidPassword ? callback(user) : callback(undefined);
        } else {
            callback(undefined);
        }
    });
}

// do this after all validation checks
// data must have a non-hashed password
var registerUser = function(data, callback) {
    bcrypt.hash(data.password, null, null, function (err, hashedPass) {
        if (err) return false;

        var user = new models.Users({
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
            if (callback) callback();
            return true;
        });
    });
}

var getQuestions = function(callback) {
    var query = models.Questions.find({});
    query.exec().then(function (questions) {

    });
}

function deleteAllUsers() {
    console.log("DELETEALLUSERS()");
    var allUsers = models.Users.find({});
    allUsers.exec().then(function (doc) {
        if (doc) {
            doc.forEach(function(user) {
            console.log("  found user: ", user.username);  
            });
        }
    });
    var users = models.Users.find({});
    users.exec().then(function (doc) {
        if (doc) {
            doc.forEach(function (user) {
                var remove = models.Users.remove(user);
                remove.exec().then(function (res) {
                    console.log("  Deleted user: " + user.username);
                })
            });
        }
    });
}

function seedDatabase() {
    var query = models.Users.findOne({ username: "admin" });
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
            answer1: "4",
            answer2: "4",
            answer3: "4",
        };
        registerUser(admin);
        for (var i = 1; i < 11; ++i) {
            var user = {
                username: "user" + i,
                password: "pass",
                age: 25,
                email: "user" + i + "@express.com",
                role: "user",
                answer1: Math.floor((Math.random() * 4)) + 1,
                answer2: Math.floor((Math.random() * 4)) + 1,
                answer3: Math.floor((Math.random() * 4)) + 1
            };
            registerUser(user);
            // user.save(function (err, user) {
            //     if (err) return console.error(err);
            //     console.log(user.username + ' added');
            //   });
        }
    });
}