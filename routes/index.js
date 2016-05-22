var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

/* GET home page. */
router.get('/', function(req, res, next) {
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
 
});

module.exports = router;
