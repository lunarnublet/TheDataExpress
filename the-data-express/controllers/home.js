var config = require("../config.json");

exports.home = function (req, res) {
    res.render("index", { config: config,
        title: "The Data Express"
    });
}