var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/indexv');
var users = require('./routes/users');
<<<<<<< HEAD
=======
var about = require('./routes/about');
var signin=require('./routes/signin');
var signup=require('./routes/signup');
var userprofile=require('./routes/userprofile');

>>>>>>> 4fb387c08b786df9879d7f6f3a7c49b9d5259f89
var app = express();
var insert = require('./routes/insert.js');
var signin=require('./routes/signin.js');
var indexx=require('./routes/index.js');
var about = require('./routes/about');
var signin=require('./routes/signin');
var signup=require('./routes/signup');
var userprofile=require('./routes/userprofile');


app.use(session({secret: 'edec12$12'}))

app.locals.points = "8,713";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexx);
app.use('/users', users);
<<<<<<< HEAD
app.use('/insert',insert);
app.use('/login',signin);
=======
>>>>>>> 4fb387c08b786df9879d7f6f3a7c49b9d5259f89
app.use('/about', about);
app.use('/signin',signin);
app.use('/signup',signup);
app.use('/userprofile',userprofile);
<<<<<<< HEAD
=======

>>>>>>> 4fb387c08b786df9879d7f6f3a7c49b9d5259f89

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
