
var express = require('express');
var router = express.Router();

/* GET home page. */
isLogged=1;
 
router.get('/', function(req, res) {
  res.render('indexx', {name:'Val',text_test:'Lorem Ipsum is simply dummy ' +
  'text of the printing and typesetting industry. ' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry. ',logged:isLogged,username:'valeria'});
});
module.exports = router;