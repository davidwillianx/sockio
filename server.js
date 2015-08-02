var express = require('express');
var Server = require('http').Server;
var logger = require('morgan');
var path  = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
require('dotenv').load();
var MongoStore = require('connect-mongo')(session);
var mongoStore = new MongoStore({url : process.env.MONGO_CONNECT});
var Message = require('./app/modules/message');
var mongoAuth = require('./app/config/mongooseauth');
mongoose.connect(mongoAuth.url);





require('./app/config/passport')(passport);
var user = require('./app/routes/user');
var ini = require('./app/routes/index');

var sessionMdw = session({
    name: process.env.SESSION_NAME ,
    secret: process.env.SESSION_SECRET,
    resave: true,
    store: mongoStore,
    saveUninitialized: true,
    cookie: {
       path: '/',
       httpOnly: true,
       secure: false,
       maxAge: null
   }
});

var app = express();
var server = Server(app);

app.set('views',path.join(__dirname,'app/views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);

app.use(logger('dev'));
app.use(favicon(__dirname+'/app/public/imgs/chat.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMdw);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/',ini);
require('./app/routes/user')(app,passport);

app.use(express.static(__dirname+'/app/public'));

app.use(function(req,res,next){
  var error  = new Error('Not found');
  error.status = 404;
  next(error);
});
//If we are on development evironment
if(app.get('env') === 'development'){
  app.use(function(req,res,next){
    res.status(error.status || 500);
    res.render('error',{
      message: error.message,
      error : error
    });
  });
}

//Production
app.use(function(req,res,next){
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: {}
  });
});


server.listen(app.get('port'),function () {
  console.log('listen in a new way');
});
var io = require('socket.io')(server);

io.use(function (socket,next) {
  var userData = socket.request || socket.handshake;
  cookieParser(process.env.SESSION_SECRET)(socket.request,{},function (error) {
     var sid = socket.request.signedCookies[process.env.SESSION_NAME];
     if(!sid) return next(new Error('User is not authenticated'));

     mongoStore.get(sid,function (error, session) {
       if(error) next(new Error('User not found'));
       socket.request.session = session;
       passport.initialize()(socket.request,{},function () {
         passport.session()(socket.request,{},function () {
            if(socket.request.user)next(null,true)
            else next(new Error('User is not autheticate'));
         });
       });
     });
  });
});


require('./app/lib/io')(io, Message);

module.exports = app;
