var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');

/* GET home page. */
usernameToSend="valeria";
router.get('/', function(req, res, next) {
    res.render('signup', { title: 'sign up',logged:0,username:usernameToSend });
});


router.post('/verify',function(req,res,next) {
  
  var user_name=req.body.username;
  var name=req.body.name;
  var prenume=req.body.prenume;
  var email=req.body.email;
  var pass=req.body.password;
  var bindVars = 
   {
      user:user_name  ,
      pass:pass,
      res: { dir: oracledb.BIND_INOUT }
   }; 
   
  global.connection.execute(
  "BEGIN verifyUserAndPass(:user,:pass,:res); END;",
  bindVars,
  function (err, result)
  {
    if (err) { console.error(err.message); 
        res.render('signup', { status:'Eror ocurred',title: 'sign up',logged:0,username:usernameToSend });
        return;  
    }
    if(result.outBinds.res==1)
           res.render('signup', { status:'User name or password incorect',title: 'sign up',logged:0,username:usernameToSend });
    else 
    {
          
        global.connection.execute("begin insert into useri values (:u,:n,:p,:e,:pass); commit; end;",
        [user_name,name,prenume,email,pass],function(err,result){
           if(err){
               res.render('signup', { status:'Eror ocurred',title: 'sign up',logged:0,username:usernameToSend });
                 return;  
           }
           req.session.username=user_name;
           req.session.email=email;
         
           console.log(result);
           res.render('indexx', {name:'Val',text_test:'Lorem Ipsum is simply dummy ' +

           'text of the printing and typesetting industry. ',logged:1,username:user_name});
           
            
        });
   
    }
    
  });
}); 


module.exports = router;
