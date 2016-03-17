var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: 443,
  sslRequiredMessage: 'SSL Required.'
});

function checkAuth(req, res, next) {
  console.log('checkAuth ' + req.url);

  // don't serve /secure to those not logged in
  // you should add to this list, for each and every secure url
  if (req.url === '/fill' && (!req.session || !req.session.authenticated)) {
    res.render('index', {
      error: "Please login first."
    });
    return;
  }
  next();
}

app.use(logger('dev'));
app.use(session({
  secret: 'G4MnTIgi0ocNqHqpPCUhvttR9Q/6GZtWWh92tR2keiupAzEMpX6f24s1LfZw3s4408QiR8aCWTPyYHT9'
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(checkAuth);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;
