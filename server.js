var http = require('http');
var express = require('express');
var logger = require('morgan');
var path  = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//waiting for passport and socket.io

var flash = require('connect-flash');

var user = require('./app/routes/user');
var ini = require('./app/routes/index');

var app = express();

app.set('views',path.join(__dirname,'app/views'));
app.set('views egine', 'ejs ');

app.set('port', process.env.PORT || 8080);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(session({
    secret: 'youshouldbebetterasfasterasyoucan',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


app.use('/',ini);
app.use('/user',user);

app.use(express.static(__dirname+'/app/public'));

var server = http.createServer(app);

server.listen(app.get('port'),function(){
  console.log('Server running');
});
