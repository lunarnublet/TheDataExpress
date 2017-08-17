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
    for(var i = 0; i < 100; ++i)
    {
        var user = new User({
            username: "TestUser",
            password: "password",
            age: "25",
            email: "test@user.idk",
            isAdmin: "false",
            answer1: (Math.random() * 3) + 1,
            answer2: (Math.random() * 3) + 1,
            answer3: (Math.random() * 3) + 1
          });
        user.save(function (err, user) {
            if (err) return console.error(err);
            console.log(user.username + ' added');
          });
    }
}

exports.home = function (req, res) {
    testuser();
    User.find("username", function (err, users) {
        if (err) return console.error(err);
        var ans1 = [];
        var strings1 = [];
        var ans2 = [];
        var strings2 = [];
        var ans3 = [];
        var strings3 = [];
        for(var i = 0; i < users.length; ++i)
        {
            var v = 0;
            var isAThing1 = false;
            while(v < strings1.length)
            {
                if(strings1[v] == users[i].answer1)
                {
                    isAThing1 = true;
                    break;
                }
                ++v;
            }
            if(isAThing1)
            {
                ++ans1[v];
            }
            else
            {
                strings1.push(users[i].answer1);
                ans1.push(1);
            }

            var v = 0;
            var isAThing2 = false;
            while(v < strings2.length)
            {
                if(strings2[v] == users[i].answer2)
                {
                    isAThing2 = true;
                    break;
                }
                ++v;
            }
            if(isAThing2)
            {
                ++ans2[v];
            }
            else
            {
                strings2.push(users[i].answer2);
                ans2.push(1);
            }

            var v = 0;
            var isAThing3 = false;
            while(v < strings3.length)
            {
                if(strings3[v] == users[i].answer3)
                {
                    isAThing3 = true;
                    break;
                }
                ++v;
            }
            if(isAThing3)
            {
                ++ans3[v];
            }
            else
            {
                strings3.push(users[i].answer3);
                ans3.push(1);
            }
        }
        for(var i = 0; i < ans1.length; ++i)
        {
            ans1[i] = (ans1[i] / users.length) * 100;
        }
        for(var i = 0; i < ans1.length; ++i)
        {
            ans2[i] = (ans2[i] / users.length) * 100;
        }
        for(var i = 0; i < ans1.length; ++i)
        {
            ans3[i] = (ans3[i] / users.length) * 100;
        }
        res.render("index", { config: config, ans1: ans1, ans2: ans2, ans3: ans3, answerNames1: strings1,answerNames2: strings2,answerNames3: strings3,
            title: "The Data Express",
        });
    });
}

// function rearrange(strings, ans)
// {
//     for(var i = 0; i < strings.length; ++i)
//     {
//         if(strings[i] == "1")
//         {
//             if(i != 0)
//             {
//                 var tempS = strings[0];
//                 var tempA = ans[0];
//                 strings[0] = strings[i];
//                 ans[0] = ans[i];
//                 strings[i] = tempS;
//                 ans[i] = tempA;
//             }
//         }
//         else if(strings[i] == "2")
//         {

//         }
//     }
// }
exports.login = function (req, res) {
    testuser();
    res.render("login", { config: config,
        title: "Login Page",
    });
}
