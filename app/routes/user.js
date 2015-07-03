var express = require('express');
var router = express.Router();

module.exports = function(app,passport){

  app.route('/user/connect')
      .post(passport.authenticate('local',{
        successRedirect: '/user/chatboard',
        failureRedirect: '/',
        failureFlash: true
      }));

  app.get('/user/chatboard',isAuthenticated,function(req,res){
    res.render('chatboard',{user: req.user});
  });

  app.get('/auth/facebook/',passport.authenticate('facebook',{scope:['email']}));
  app.get('/auth/facebook/callback',passport.authenticate('facebook',{
    successRedirect: '/user/chatboard',
    failureRedirect: '/',
    failureFlash: true
  }));
};

function isAuthenticated(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/');
}
