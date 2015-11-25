var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var moment = require('moment');
var mongoose = require('mongoose');

var routes = require('./server/routes');

var app = express();
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'server', 'views'));

app.engine('.hbs', hbs({
	defaultLayout: 'main', 
	extname: '.hbs',
	layoutsDir: app.get('views') + '/layouts',
	partialsDir: app.get('views') + '/partials',
	helpers: {
		timeago: function(timestamp) {
			return moment(timestamp).startOf('minute').fromNow();
		}
	}	
  })
);
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // prob. for better json parsing experience should be set to true
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

routes.initialize(app, router);

mongoose.connect('mongodb://vnik:vnik@ds059694.mongolab.com:59694/heroku_731vv05c');
mongoose.connection.on('open', function() {
	console.log('Mongoose connected.');
});

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

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;
