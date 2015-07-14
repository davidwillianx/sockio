
module.exports = function(io,Message){

  /*
  test features::>
    load previous message
    load users already connected
  */

  io.on('connect',function(client){
      Message.find({},function (error,prevMessage) {
        if(!error)
          client.emit('previous-messages',prevMessage);
      });
  });
}
