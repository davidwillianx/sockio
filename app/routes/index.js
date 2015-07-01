var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
  res.render('index.ejs',{tomato: 'David'});
});

module.exports = router;
