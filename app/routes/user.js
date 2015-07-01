var express = require('express');
var router = express.Router();


router.get('/',function(req, res){
  res.send('esmotas no user');
});

module.exports = router;
