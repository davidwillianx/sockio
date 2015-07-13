
module.exports = function(io){

  io.on('connect',function(client){
      client.emit('previous-messages',{message: 'we are loading our prev'})
  });
}
