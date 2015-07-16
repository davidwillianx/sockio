
module.exports = function(io,Message){

  /*
  test features::>
    load previous message
    load users already connected
  */

  io.on('connect',function(client){
    var clientId = client.request.session.passport;
    console.log(clientId);
      Message.find({},function (error,prevMessage) {
        if(!error)
          client.emit('previous-messages',prevMessage);
      });
  });
}
