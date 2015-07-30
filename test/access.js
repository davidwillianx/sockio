var expect = require('chai').expect;
var should = require('chai').should();
var User = require('../app/modules/user');
var app = require('../server');
// var app = 'http://localhost:8080';
var request = require('supertest');
require('dotenv').load();

describe('user access', function() {
  var sockPaths = {
    'authentication': '/user/connect',
    'dashboard': '/user/chatboard'
  };

  before(
    function (done){
      request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type','text/html; charset=utf-8')
      .end(function (error,res) {
        expect(error).not.exist;
        done();
    });
  });
  after(function (done) {
    User.remove().exec();
    done();
  });
  it('should not have dashboard access', function(done) {
      request(app)
      .get(sockPaths.dashboard)
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
    request(app)
    .post(sockPaths.authentication)
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
    request(app)
    .post(sockPaths.authentication)
    .send(userAuthorized)
    .expect(302)
    .end(function (error, res) {
      expect(res.header.location).to.equal(sockPaths.dashboard);
      done();
    });
  });
});
