//just for mock some messages

module.exports = function (Message) {
  var rMessage  = new Message();
      // ,lMessage
      // ,luMessage = new Message();
  rMessage.author = 'Rosivaldo';
  rMessage.msg = 'Network is everything';

  // lMessage.author = 'Laerte';
  // lMessage.msg = 'Laravel is everything';
  //
  // luMessage.author = 'Luiz';
  // luMessage.msg = 'Cake is everything';
  rMessage.save(function (error) {
    if(error)
      throw error
  });
  // Promisse.all([rMessage.save(),lMessage.save(),luMessage.save()])
  //           .then()
};
