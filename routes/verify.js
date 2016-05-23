var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');


router.post('/',function(req,res){
  var username=req.body.username;
  var pass=req.body.password;
  var bindVars = 
   {
      user:username  , 
      pass:pass,
      res: { val:'' , dir: oracledb.BIND_INOUT },
   }; 
   
  global.connection.execute(
  "BEGIN check_user(:user,:pass,:res); END;",
  bindVars,
  function (err, result)
  {
    if (err) { console.error(err.message); 
         res.render('signin', {status:'Connection error!' ,title: 'sign in',logged:0,username:usernameToSend });
        return;  
    }
    if(result.outBinds.res==1)
     {
          req.session.username=username;
          res.redirect('/');
     }
    else  res.render('signin', {status:'Incorect username or password!' ,title: 'sign in',logged:0,username:usernameToSend });
  });
    
    
});

router.post('/username',function(req,res) {
   
  var username=req.body.username;
  console.log(username);
  var bindVars = 
   {
      user:username  , 
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