
var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
/* GET home page. */
isLogged=0;
 
router.get('/', function(req, res) {
    
   oracledb.getConnection(
  {
    user          : "edec",
    password      : "edec",
    connectString : "localhost/XE"
  },
  function(err, connection)
  {
     // res.send(prds[0].product_type);
    if (err) { res.render('index', { title: 'Express',conn:err.message}); return ; }
    global.connection=connection;
     
  //res.render('index', { title: 'Express',conn:"Conected!" });
  
  res.render('indexx', {name:'Val',text_test:'Lorem Ipsum is simply dummy ' +
  'text of the printing and typesetting industry. ' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry. ',logged:isLogged,username:'valeria'});
      }); 
});
module.exports = router;