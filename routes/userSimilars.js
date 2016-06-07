var express = require('express');
var router = express.Router();

var food_procedure='nr_matched_food_products';
var electronics_procedure='USER_SIMILAR';
var hotels_procedure='nr_matched_products';
var fs=require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var username=req.session.username;
  if(!username)
  {
      res.send("Must be logged!");
      return;
  }
  var category=req.query.category;
  if(category=='electronics')
  {
      getSimilarsUsers(res,username,electronics_procedure);
      return;
  }
  if(category=='food')
  {
      getSimilarsUsers(res,username,food_procedure);
      return;
  }
  
  if(category=='hotels')
  {
      getSimilarsUsers(res,username,hotels_procedure);
      return;
  }
  
  res.send("Specify a category!");
  
});



function getSimilarsUsers(res,user,procedure)
{
    
    global.connection.execute('select username,nume,prenume,'+procedure+'(:u,username) as  sim  from useri where username !=:u order by sim desc',
    [user],function(err,result){
       
        if(err)
        {
            console.log(err.message);
            res.send('An error ocurred!');
            return;
        }
        var useri=[];
        for(var row in result.rows)
        {
            var usr=[];
            usr.name=result.rows[row][0];
            usr.nume=result.rows[row][1];
            usr.prenume=result.rows[row][2];
            usr.image=getUserImage(usr.name);
            useri[row]=usr;            
        }
        res.render('components/usersimilars',{users:useri});
        
    });
    
    
    
    
    
}


router.get('/sendMessage',function(req,res){
   
   var username=req.session.username;
   if(!username)
   {
       res.send("Must be logged!");
       return;
   }
   var toUser=req.query.toUser;
   var message=req.query.message;
   
   global.connection.execute('begin insert_notify(:u,:t,:m); end;',
    [toUser,'Message from '+username,message],function(err,result){
       
       if(err)
       {
           console.log(err.message);
           res.send("Message canot be sent!");
           return;
       } 
       res.send("Mesage sent!");
        
    });
   
    
});



function fileExists(filePath)
{
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
}

function getUserImage(user)
{
    if(!fileExists(__dirname.substring(0,__dirname.length-7)+'/public/images/profilesIMG/'+user+'.jpg'))
    {
        console.log("TESTAT: "+__dirname.substring(0,__dirname.length-7)+'/public/images/profilesIMG/'+user+'.jpg');
        return "/images/profile.png";

    }
    else return '/images/profilesIMG/'+user+'.jpg';
}



















module.exports = router;