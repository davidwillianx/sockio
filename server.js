var http = require('http');
var express = require('express');
var logger = require('morgan');
var path  = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');

var Message = require('./app/modules/message');
var mongoAuth = require('./app/config/mongooseauth');
mongoose.connect(mongoAuth.url);

require('./app/config/passport')(passport);

var user = require('./app/routes/user');
var ini = require('./app/routes/index');

var app = express();

app.set('views',path.join(__dirname,'app/views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 8080);

app.use(logger('dev'));
app.use(favicon(__dirname+'/app/public/imgs/chat.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(session({
    secret: 'youshouldbebetterasfasterasyoucan',
    resave: true,
    saveUninitialized: true
}));
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

var server = http.createServer(app);
var io = require('socket.io')(server);
require('./app/lib/io.js')(io,Message);

server.listen(app.get('port'),function(){
  console.log('Server running' + app.get('port'));
});
