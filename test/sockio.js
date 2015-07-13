var client = require('socket.io-client')('http://localhost:8080');
var request = require('supertest')('http://localhost:8080');
var mongoose  = require('mongoose');
var should = require('chai').should();
var expect = require('chai').expect;


 describe('websocket chat transactions', function() {
   before(function (done) {
      var userChato = {
        'email': 'test@test.com',
        'password':'test',
        'nickname': 'chato'
      };
      request.post('/user/connect')
      .send(userChato)
      .expect(302)
      .end(function (error, res){
        expect(res.header.location).to.equal('/user/chatboard');
        done();
      });
   });

   describe('startUp', function() {
     it('should be connected', function(done) {
       client.on('previous-messages',function (messages) {
        //  expect(messages).not.to.be.null;
        //  expect(messages.length).to.equal(3);
         done();
       });
     });
   });
 });
