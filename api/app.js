var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require("cors");
var indexRouter = require('./routes/index');
var getLocationsRouter = require("./routes/getLocations");
var setPromptRouter = require("./routes/setPrompt");
var setPromptRouter = require("./routes/setPrompt");
var filesRouter = require("./routes/filesRouter");
const { router: authRouter } = require('./routes/authRouter');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const { initialize } = require('./modules/init');

app.use('/', indexRouter);
app.use("/api", getLocationsRouter);
app.use("/api", setPromptRouter);
app.use("/auth", authRouter);
app.use("/api/protected", filesRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

initialize().then(() => {
  console.log('Initialization complete');
  // Start the server here or perform other setup tasks
}).catch(err => {
  console.error('Failed to initialize:', err);
});


module.exports = app;
