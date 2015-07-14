var client = require('socket.io-client');
var request = require('supertest')('http://localhost:8080');
var mongoose  = require('mongoose');
var should = require('chai').should();
var expect = require('chai').expect;




 describe('websocket chat transactions', function() {
   var ioClient;
   mongoose.connect('mongodb://localhost/sockio');
   var Message = require('../app/modules/message');
   var User = require('../app/modules/user');

   before(
     function (done) {
       User.remove().exec();
       Message.remove().exec();
       done();
     },
     function (done) {
       var newMsg = new Message();
       newMsg.author = 'Test';
       newMsg.msg = 'Something may it workg';
       newMsg.time = null;
       newMsg.save(done);
     },
     function (done) {
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
      }
   );

   describe('startUp', function() {
     it('should be connected', function(done){
       ioClient = client('http://localhost:8080');
       ioClient.on('previous-messages',function(messages) {
         expect(messages).not.to.be.null;
         expect(messages.length).to.equal(3);
         done();
       });
     });
   });
 });
