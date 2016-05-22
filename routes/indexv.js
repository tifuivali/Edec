var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

/* GET home page. */
isLogged=0;
 
router.get('/', function(req, res, next) {
<<<<<<< HEAD
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
     
      res.render('index', { title: 'Express',conn:"Conected!" });
    }); 
 
=======
  res.render('index', { title: 'Express' ,name:'Val',text_test:'Lorem Ipsum is simply dummy ' +
  'text of the printing and typesetting industry. ' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry. ',logged:isLogged,username:'valeria'});
>>>>>>> 7b7d2ffd9731e1bef571ebea77e4be55d768d224
});


module.exports = router;
