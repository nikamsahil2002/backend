var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require("cors"); 
require('dotenv').config(true);

var indexRouter = require('./src/routes/index');

var app = express();
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.statusCode  || 500);
    res.send({
      status: err.statusCode || 500,
      message: err.message
    });
});

module.exports = app;
