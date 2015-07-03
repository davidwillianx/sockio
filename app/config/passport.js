
//Strategies
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


//Db modules
var User = require('../modules/user');

//authze
var Auth = require('./auth.js');

module.exports = function(passport){

  passport.serializeUser(function(user,done){
    return done(null,user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id,function(error, user){
      done(error, user);
    });
  });

  passport.use('local',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },function(req,email,password,done){
  process.nextTick(function(){
        if(!req.user)
          User.findOne({'email': email},function(error, user){
            if(error)
              return done(error);
            if(user)
               done(null,user);
            else{
              var newUser = new User();
              newUser.email = email;
              newUser.nickname = req.body.nickname;
              newUser.password = newUser.generateHash(password);
              newUser.save(function(error){
                if(error)
                  throw error;
                done(null, newUser);
              });
            }
          });
      });
  }));

  passport.use(new FacebookStrategy({
    clientID : Auth.facebook.clientID,
    clientSecret : Auth.facebook.clientSecret,
    callbackURL : Auth.facebook.callbackURL,
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender'],
    passReqToCallback: true
  },function(req, accessToken, refreshToken, profile,done){
      console.log(profile);
      User.findOne({'facebook.id': profile.id},function(error, faceUser){
          if(error)
            return done(error);
          if(faceUser)
            return done(null, faceUser);
          else {
            faceUser = new User();
            faceUser.facebook.id = profile.id;
            faceUser.facebook.toke = accessToken;
            faceUser.facebook.email = profile.emails[0].value,
            faceUser.facebook.picture = profile.photos[0].value
            faceUser.save(function (error){
                if(error)
                  throw error;
                done(null,faceUser);
            });
          }
      });
  }));

};