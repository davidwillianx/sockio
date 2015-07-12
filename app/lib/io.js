
module.exports = function(io){

  io.on('connect',function(client){
    console.log('Connection');

    client.on('broadcast request',function (message) {
      console.log(message);
      client.emit('broadcast response',{status: 'ok', message: 'hurdue'});
    })
  });

}
