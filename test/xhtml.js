var xhrPath = 'socket.io-client/node_modules/engine.io-client/node_modules/xmlhttprequest';

require(xhrPath);

var cachedName = require.resolve(xhrPath);
var cachedXhr = require.cache[cachedName];
var stdXhr = cachedXhr.exports;

var cbs = {};
cbs.setAccess = function () {
  console.log('acesss setting');
}

var newXhr = function () {
  stdXhr.apply(this, arguments);
  for (var method in cbs) {
    if(typeof cbs[method] === 'function'){
      cbs[method].apply(this,arguments);
    }
  }
};

newXhr.XMLHttpRequest = newXhr;

cachedXhr.exports = newXhr;
module.exports = newXhr;
module.exports.cbs = cbs;
