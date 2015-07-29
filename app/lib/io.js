require('dotenv').load();
var cookieParser = require('cookie-parser');
module.exports = function(io,Message){

  /*
  test features::>
    load previous message
    load users already connected
  */

  io.on('connection',function(client){
    console.log('new session user');
    console.log(client.request.session);
    Message.find({},function (error, messages) {
      if(error) client.emit('error',{message: 'previous-messages would get back any data, plz wait a minut'});
      client.emit('previous-messages',messages);
    });
  });

  io.on('error',function (client) {
    console.log('Auth problem');
    io.diseconnect(client);
  });
}
