//just for mock some messages

module.exports = function (Message,cb) {
  Message.create([
    {
      author:'Rosivaldo',
      msg: 'Internet of everything'
    },
    {
      author:'Laerte',
      msg:'Laravel the best framework'
    },
    {
      author: 'Luiz',
      msg: 'Nothing is better than cake'
    }
  ],cb);
};
