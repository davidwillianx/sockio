var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
  res.render('index',{message: req.flash('accessproblems')});
});

module.exports = router;
