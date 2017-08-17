exports.saveCurrentTime = function(req, res, next) {
    var time = new Date().toLocaleString();
    req.cookies.time = time;
    next();
}

exports.destroyUserSession = function(req, res, next) {
    if (req.session.user) {
        delete req.session.user;
    }
}

exports.authenticate = function(role) {
    return function (req, res, next) {
        console.log("AUTHENTICATE(" + (role ? role : "") + ")");
        if (req.session.user) {
            console.log("  user is logged in");
            if (!role) {
                next();                
            }
            else {
                if (req.session.user.role === role) {
                    console.log("  user is of role:", role);                                    
                    next();
                }
                else {
                    console.log("  user is not of role:", role);                        
                    res.redirect('/login');
                }
            }
        }
        else {
            console.log("  user isn't logged in");        
            res.redirect('/login');
        }
    }
}