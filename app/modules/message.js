var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  author: String,
  msg: String,
  time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', messageSchema);
