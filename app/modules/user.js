var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local:{
    email: String,
    password: String,
    nickname: String
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    picture: String,
    email: String,
    name: String
  }
});

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userSchema.methods.isValidPassword = function(password){
  return bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('User', userSchema);
