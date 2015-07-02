var express = require('express');
var router = express.Router();

module.exports = function(app,passport){

  app.route('/user/connect')
      .post(passport.authenticate('local',{
        successRedirect: '/user/chatboard',
        failureRedirect: '/',
        failureFlash: true
      }));
      
  app.get('/user/chatboard',isAutheticated,function(req,res){
    res.render('chatboard',{user: req.user});
  });
};

function isAutheticated(req,res,next){
  if(req.isAuthenticated())
    return next();
  res.redirect('/');
}
