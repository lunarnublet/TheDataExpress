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

exports.home = function (req, res) {
    res.render("index", { config: config,
        title: "The Data Express"
    });
}