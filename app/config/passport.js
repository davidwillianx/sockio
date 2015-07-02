
//Strategies
var LocalStrategy = require('passport-local').Strategy;

//Db modules
var User = require('../modules/user');

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
};
