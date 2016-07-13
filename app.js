var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var knex          = require('knex')
var pg            = require('pg')
var routes        = require('./routes/index');
var users         = require('./routes/users');
var app           = express();
var passport      = require('passport');
var fs            = require('fs');
var cors          = require('cors')
var jwt           = require('jsonwebtoken')
var aws           = require('aws-sdk')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:8080");
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use('/s3', require('react-s3-uploader/s3router')({
  bucket: "heirloom-toronto",
  ACL: 'private'
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/users', users);

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
