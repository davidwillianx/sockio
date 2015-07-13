var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var request = require('supertest')('http://localhost:8080');


describe('user access', function() {
  var sockPaths = {
    'authentication': '/user/connect',
    'dashboard': '/user/chatboard'
  };

  before(
    function (done){
      request.get('/')
      .expect(200)
      .expect('Content-Type','text/html; charset=utf-8')
      .end(function (error,res) {
        expect(error).not.exist;
        done();
    }),
    function(done){
      mongoose.connect('http://localhost:8080');
      //drop user collection
    }
  });
  it('should not have dashboard access', function(done) {
      request.get(sockPaths.dashboard)
      .expect(302)
      .end(function(error,res){
        should.not.exist(error);
        expect(res.header.location).to.not.equal(sockPaths.dashboard);
        done();
      });
  });

  it('should not have login', function(done) {
    var userUnauthorized = {
        'email':'test@testmail.com'
        // ,'password': 'testamazing'
        //,'nickname': 'nickloadeon'
      };
    request.post(sockPaths.authentication)
    .send(userUnauthorized)
    .expect(302)
    .end(function (error, res) {
      expect(res.header.location).to.not.equal(sockPaths.dashboard);
      done();
    });
  });

  it('should permit user access', function(done) {
    var userAuthorized = {
      'email': 'test@test.com',
      'password':'test',
      'nickname': 'chato'
    };
    request.post(sockPaths.authentication)
    .send(userAuthorized)
    .expect(302)
    .end(function (error, res) {
      expect(res.header.location).to.equal(sockPaths.dashboard);
      done();
    });
  });
});
