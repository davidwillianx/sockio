var client = require('socket.io-client');
var request = require('supertest');
var mongoose  = require('mongoose');
var should = require('chai').should();
var expect = require('chai').expect;
// var app = require('../server');
var app = 'http://localhost:8080';
var User = require('../app/modules/user');
var Message = require('../app/modules/message');

require('dotenv').load();

describe('websocket chat transactions', function() {
 var ioClient;

 before(
   function (done) {
     mongoose.connection.close();
     mongoose.connect(process.env.MONGO_CONNECT);
     User.remove().exec();
     Message.remove().exec();
     done();
   },
   function(done) {
      var userChato = {
        'email': 'test@test.com',
        'password':'test',
        'nickname': 'chato'
      };
      request(app)
      .post('/user/connect')
      .send(userChato)
      .expect(302)
      .end(function (error, res){
        expect(res.header.location).to.equal('/user/chatboard');
        done();
      });
    }
  );
  after(function (done) {
   mongoose.connection.close();
   done();
  });
/*
   Online List
   Messages come in / out
   Emojis
*/
 describe('Message socket', function() {
   before(function (done) {
     Message.remove().exec();
     User.remove().exec();
      require('./messageMkp')(Message,done);
   });
   after(function (done) {
     User.remove().exec();
     done();
   });
   it('should be connected', function(done){
     request(app)
     .post('/user/connect')
     .send({email: 'chat@test.com', password: 'chat309', nickname: 'thor'})
     .expect(302)
     .end(function (error,res) {
       expect(res.header.location).to.be.equal('/user/chatboard');
       ioClient = client('http://192.168.1.151:8080');
      //  ioClient.on('previous-messages',function (messages) {
      //    console.log(messages);
      //    expect(messages.length).to.be.equal(3);
      //    done();
      //  });
        done();
      });
    });
  });
});
