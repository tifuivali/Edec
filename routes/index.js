
var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
/* GET home page. */
isLogged=0;



router.get('/view',function (req, res, next) {
  // Update views
  req.session.views = (req.session.views || 0) + 1

  // Write response
  res.end(req.session.views + ' views')
});

 
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
  var user='';
  if(req.session)
  if(req.session.username)
  {
      user=req.session.username;
      console.log('user '+user);
      isLogged=1;
  }
  res.render('indexx', {name:'Val',text_test:'Lorem Ipsum is simply dummy ' +
  'text of the printing and typesetting industry. ' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry. ',logged:isLogged,username:user});
      }); 
});
module.exports = router;