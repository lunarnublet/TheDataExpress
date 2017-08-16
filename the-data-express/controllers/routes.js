var config = require("../config.json");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
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
  isAdmin: String,
  answer1: String,
  answer2: String,
  answer3: String
});

var User = mongoose.model('User_Accounts', userSchema);

function testuser ()
{
    var user = new User({
        username: "TestUser",
        password: "password",
        age: "25",
        email: "test@user.idk",
        isAdmin: "false",
        answer1: "1",
        answer2: "4",
        answer3: "2"
      });
    user.save(function (err, user) {
        if (err) return console.error(err);
        console.log(user.username + ' added');
      });
}

exports.home = function (req, res) {
    testuser();
    res.render("index", { config: config,
        title: "The Data Express",
    });

}
exports.login = function (req, res) {
    testuser();
    res.render("login", { config: config,
        title: "Login Page",
    });
}
