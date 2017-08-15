exports.control = function (req, res) {
    cookies.writeCurrentTime(req);
    var users = [
        {id:1, username: 'foo', email: 'foo@gmail.com', age: 322},
        {id:2, username: 'bar', email: 'bar@gmail.com', age: 232},
        {id:3, username: 'baz', email: 'baz@gmail.com', age: 223},
    ];

    res.render('admin', {config: config, users: users, time: req.cookies.time});
};