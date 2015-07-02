var mongoose  = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  email: String,
  password: String,
  nickname: String
});

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userSchema.methods.isValidPassword = function(password){
  return bcrypt.compare(password,this.password);
};

module.exports = mongoose.model('User', userSchema);
