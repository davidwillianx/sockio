
module.exports = function(io){

  io.on('connect',function(client){
    //emitLoadPreviousMessages

    client.on('broadcast request',function(message) {
      client.broadcast.emit('broadcast response',message);
    });

    
  });
}
