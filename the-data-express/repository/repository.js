var bcrypt = require('bcrypt-nodejs');
var models;
module.exports = function(mongooseModels) {
    models = mongooseModels;
    // deleteAllUsers();
    seedDatabase();

    models.tryLoginUser = tryLoginUser;
    models.registerUser = registerUser;
    models.editUser = editUser;

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

function generateQuestions()
{
    console.log("GENERATEQUESTIONS()");



    models.Questions.find({}, function (err, questions) {
        if (err) return console.error(err);

        // questions.forEach(function (question) {
        //     var remove = models.Questions.remove(question);
        //     remove.exec().then(function (res) {
        //         console.log("  Deleted question: " + question.question);
        //     });
        // });
        if(questions.length == 0)
        {
            var question1 = new models.Questions({
                question: "What is the distance from the Earth to the moon?",
                answer1: "2,800 mi",
                answer2: "50,600 mi",
                answer3: "238,900 mi",
                answer4: "561,200 mi"
            });

            var question2 = new models.Questions({
                question: "Which civilization did Poseidon belong to?",
                answer1: "Roman",
                answer2: "Greek",
                answer3: "Aztec",
                answer4: "Mongolian"
            });

            var question3 = new models.Questions({
                question: "What is the freezing point of water?",
                answer1: "0 degrees celsius",
                answer2: "0 degrees fahrenheit",
                answer3: "5 degrees celsius",
                answer4: "5 degrees fahrenheit"
            });

            question1.save(function (err, user) {
                if (err) console.error("Question 1 failed to save.");
                console.log("Saved question 1.");
            });
            question2.save(function (err, user) {
                if (err) console.error("Question 2 failed to save.");
                console.log("Saved question 2.");
            });
            question3.save(function (err, user) {
                if (err) console.error("Question 3 failed to save.");
                console.log("Saved question 3.");
            });
        }
        else
        {
            console.log("No questions added.");
        }
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
    generateQuestions();
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