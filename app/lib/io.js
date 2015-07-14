
module.exports = function(io,Message){


  io.on('connect',function(client){
    client.emit('previous-messages', Message.find({},function(error , messages) {
      if(error) client.emit('previous-messages loaderror',{error: error});
      if(!messages) client.emit('previous-messages empty',{message: 'No message'});
      else client.emit('previous-messages',{previousmsg: messages});
    }));
  });
}
