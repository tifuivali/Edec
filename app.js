var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');

var routes = require('./routes/indexv');
var users = require('./routes/users');

var about = require('./routes/about');
var signin=require('./routes/signin');
var signup=require('./routes/signup');
var userprofile=require('./routes/userprofile');
var verify=require('./routes/verify.js');

var app = express();
var insert = require('./routes/insert.js');
var signin=require('./routes/signin.js');
var indexx=require('./routes/index.js');
var about = require('./routes/about');
var signin=require('./routes/signin');
var signup=require('./routes/signup');
var userprofile=require('./routes/userprofile');
var logout=require('./routes/logout');
var hotelpreferences=require('./routes/hotelpreferences');
var hotelpreferences_loc=require('./routes/hotelpreferences_loc');
var hotel_types=require('./routes/hotel_types');
var restaurantpref=require('./routes/restaurantpref');
var restaurant_loc=require('./routes/restaurant_loc');
var search=require('./routes/search');
var amazonapi=require('./routes/amazonapi');
var electronic=require('./routes/electronics/electronicsPreferences');
var eb=require('./routes/tests/ebaytest');
var notify=require('./routes/notify');

app.locals.points = "8,713";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


app.use('/', indexx);
app.use('/users', users);

app.use('/insert',insert);
app.use('/login',signin);
app.use('/electronics',electronic);
app.use('/about', about);
app.use('/signin',signin);
app.use('/signup',signup);
app.use('/userprofile',userprofile);
app.use('/verify',verify);
app.use('/logout',logout);
app.use('/hotelpreferences',hotelpreferences);
app.use('/hotelpreferences_loc',hotelpreferences_loc);
app.use('/hotel_types',hotel_types);
app.use('/restaurantpref',restaurantpref);
app.use('/restaurant_loc',restaurant_loc);
app.use('/search',search);
app.use('/amazon',amazonapi);
app.use('/ebay',eb);
app.use('/notify',notify);


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
