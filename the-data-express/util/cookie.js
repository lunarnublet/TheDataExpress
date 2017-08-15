exports.saveCurrentTime = function(req) {
    var time = new Date().toLocaleString();
    req.cookies.time = time;
}

exports.saveUserSession = function(req, user) {

}

exports.destroyUserSession = function(req) {

}

exports.session = function(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        next();
    }
}

exports.authenticate = function(role) {
    var allowed = true;
    if (role) {
    }
}