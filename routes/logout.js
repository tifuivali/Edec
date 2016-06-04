var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  
  req.session.destroy(function(err){
      console.log("session canot be destroyed!");
      return; 
  });
    
  res.render('indexx', {name:'Val',logged:0});
});


module.exports = router;