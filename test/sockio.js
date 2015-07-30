var request = require('supertest');
var requestAgnt = require('request');
var should = require('chai').should();
var expect = require('chai').expect;
var mongoose  = require('mongoose');
var app = require('../server');

var xhr = require('./xhtml');
var User = require('../app/modules/user');
var Message = require('../app/modules/message');
require('dotenv').load();

describe('websocket chat transactions', function() {
 var pathURL = 'http://192.168.1.151:8080';

  before(function (done) {
     mongoose.connection.close();
     mongoose.connect(process.env.MONGO_CONNECT);
     User.remove().exec();
     Message.remove().exec();
     done();
   });

  after(function (done) {
    mongoose.connection.close();
    done();
  });

  beforeEach(function (done) {
    console.log('acessFeature');
    var cookies = requestAgnt.jar();

    requestAgnt.get({
      url: pathURL,
      jar: cookies
    },function (error, res, body) {
        should.not.exist.error;

        requestAgnt.post({
          url: pathURL+'/user/connect',
          jar: cookies,
          form:{
            email: 'chat@chato.com',
            password: 'imchatuser',
            nickname: 'chatUserTestFirstReq'
          }
        },function (error, res, body) {
          should.not.exist.error;
          expect(res.statusCode).to.be.equal(302);
          expect(res.headers.location).to.be.equal('/user/chatboard');

          xhr.cbs.setAccess = function () {
            this.setDisableHeaderCheck(true);
            var stdOpen = this.open;
            this.open = function () {
              stdOpen.apply(this, arguments);
              this.setRequestHeader('Cookie', res.request.headers.cookie);
            }
          }
          done();
        });
    });
  });

/*
   Online List
   Messages come in / out
   Emojis
*/

 it('should have websocket connection', function(done) {
    var ioClient = require('socket.io-client')(pathURL,{forceNew: true});
    ioClient.disconnect();
    done();
 });
 it('should connect and get 3 previous messages', function(done) {
    require('./messageMkp')(Message,function (error) {
      should.not.exist.error;
      var ioClient = require('socket.io-client')(pathURL,{forceNew: true});
      ioClient.on('previous-messages', function (messages) {
        expect(messages.length).to.be.equal(3);
        ioClient.disconnect();
        done();
      });
    });
 });
});
