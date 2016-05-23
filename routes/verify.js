var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');


router.get('/',function(req,res){
   
   res.send('okkkk'); 
});

router.post('/username',function(req,res) {
   
  var username=req.body.username;
  console.log(username);
  var bindVars = 
   {
      user:username  , // default direction is BIND_IN. Datatype is inferred from the data
      res: { val:'' , dir: oracledb.BIND_INOUT },
   }; 
   
  global.connection.execute(
  "BEGIN verifyUserName(:user,:res); END;",
  bindVars,
  function (err, result)
  {
    if (err) { console.error(err.message); 
        res.send('err');
        return;  
    }
    if(result.outBinds.res==1)
      res.send('exists');
    else res.send('ok'); 
});

});

router.get('/username',function(req,res) {
   
  var username=req.body.username;
  console.log(username);
  global.connection.execute(
  "BEGIN verifyUserName(:user,:res); END;",
  bindVars,
  function (err, result)
  {
    if (err) { console.error(err.message); 
        return;  
    }
    if(result.outBinds.res==1)
      res.send('This username is already exists!');
    else res.send('Your username is available!'); 
});

});
module.exports = router;