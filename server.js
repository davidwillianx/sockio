var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var user = require('./app/routes/user');
var ini = require('./app/routes/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use('/',ini);
app.use('/user',user);


var server = http.createServer(app);
server.listen(8080,function(){
    console.log('here we comes');
});
