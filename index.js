"use strict";
exports.__esModule = true;
var express_1 = require("express");
var express_session_1 = require("express-session");
var path_1 = require("path");
var Article = /** @class */ (function () {
    function Article(name, title, contents) {
        this.name = name;
        this.title = title;
        this.contents = contents;
    }
    return Article;
}());
var bbs = [
    { name: 'tj', title: 'hello', contents: 'nice to meet you' },
    { name: 'bj', title: 'I\'m new here', contents: 'yoroshiku' },
    { name: 'tj', title: 'here again!', contents: 'anybody here?' },
    { name: 'ts', title: 'rich people', contents: 'money ain\'t an issue' },
];
function listBbs(req, res, next) {
    try {
        res.render('bbs', { list: bbs });
    }
    catch (error) {
        next(error);
    }
}
;
function writeBbs(req, res, next) {
    try {
        if (!req.session.user) {
            res.redirect("login");
        }
        else {
            bbs.push({ name: req.session.user.name, title: req.body.title, contents: req.body.contents });
            res.redirect("/bbs");
        }
    }
    catch (error) {
        next(error);
    }
}
var User = /** @class */ (function () {
    function User(name, password) {
        this.name = name;
        this.password = password;
    }
    return User;
}());
var users = [
    { name: 'tj', password: 'foobar' },
    { name: 'bj', password: 'pass' },
    { name: 'kj', password: 'word' },
    { name: 'ts', password: 'ts' },
    { name: 'tl', password: 'tl' },
];
function findUser(name) {
    var user = users.find(function (user) { return user.name === name; });
    if (!user)
        return null;
    else
        return user;
}
function authenticate(name, pass, fn) {
    var user = findUser(name);
    if (!user)
        return fn(null);
    if (pass === user.password)
        return fn(user);
    fn(null);
}
function index(req, res, next) {
    try {
        res.redirect('/login');
    }
    catch (error) {
        next(error);
    }
}
;
function signUp(req, res, next) {
    try {
        res.render('login', { loggedin: req.session.user });
        res.redirect('/');
    }
    catch (error) {
        next(error);
    }
}
;
function logIn(req, res, next) {
    try {
        authenticate(req.body.username, req.body.password, function (user) {
            if (user) {
                req.session.regenerate(function () {
                    req.session.user = user;
                    req.session.success = 'username: ' + user.name;
                    res.redirect('back');
                });
            }
            else {
                req.session.error = '비밀번호가 틀렸습니다. '
                    + ' (use "tj" and "foobar")';
                res.redirect('/');
            }
        });
    }
    catch (error) {
        next(error);
    }
}
;
function logOut(req, res, next) {
    try {
        req.session.destroy(function () {
            res.redirect('/');
        });
    }
    catch (error) {
        next(error);
    }
}
;
function restricted(req, res, next) {
    try {
        if (req.session.user) {
            res.render("restricted");
        }
        else {
            req.session.error = '접근 금지!';
            res.redirect('/');
        }
    }
    catch (error) {
        next(error);
    }
}
;
function register(req, res, next) {
    try {
    }
    catch (error) {
        next(error);
    }
}
;
var App = /** @class */ (function () {
    function App() {
        this.app = (0, express_1["default"])();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    App.prototype.listen = function (port) {
        this.app.listen(port);
    };
    App.prototype.initializeMiddlewares = function () {
        this.app.set('view engine', 'ejs');
        this.app.set('views', path_1["default"].join(__dirname, 'views'));
        this.app.use(express_1["default"].urlencoded({ extended: false }));
        this.app.use((0, express_session_1["default"])({
            resave: false,
            saveUninitialized: false,
            secret: 'asdf!@#$qwer'
        }));
        this.app.use(function (req, res, next) {
            var err = req.session.error;
            var msg = req.session.success;
            delete req.session.error;
            delete req.session.success;
            res.locals.message = '';
            if (err)
                res.locals.message = '<p class="msg error">' + err + '</p>';
            if (msg)
                res.locals.message = '<p class="msg success">' + msg + '</p>';
            next();
        });
    };
    App.prototype.initializeRoutes = function () {
        this.app.get('/', index);
        this.app.get('/login', signUp);
        this.app.post('/login', logIn);
        this.app.get('/restricted', restricted);
        this.app.get('/logout', logOut);
        this.app.get('/bbs', listBbs);
        this.app.get('/write', writeBbs);
        this.app.get('/register', register);
    };
    return App;
}());
var app = new App();
app.listen(8080);
