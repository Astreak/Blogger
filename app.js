var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session=require("express-session");
const ejs=require('ejs');
var File=require('session-file-store')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser("Hellomate@123"));
// app.use(session({
//   name:"prj",
//   secret:"Aezakmi@1",
//   saveUnInitialized:false,
//   resave:false,
//
//
// }));
//
// function auth (req, res, next) {
//   console.log(req.session);
//   if (!req.session.prj) {
//     var authHeader = req.headers.authorization;
//     if (!authHeader) {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         next(err);
//         return;
//     }
//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var user = auth[0];
//     var pass = auth[1];
//     if (user == 'admin' && pass == 'password') {
//         req.session.prj="admin";
//         next();
//     } else {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         next(err);
//     }
//   }
//   else {
//       if (req.session.prj === 'admin') {
//           next();
//       }
//       else {
//           var err = new Error('You are not authenticated!');
//           err.status = 401;
//           next(err);
//       }
//   }
// }
//
//
//
//
// app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
// app.listen(4000,()=>{
//   console.log("Server Is on");
// });

module.exports = app;
