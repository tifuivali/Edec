var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var userReviews = require('./userprofile/userReviewsController');


/* GET home page. */
var username='';
router.get('/', function(req, res, next) {
    if(req.session.username)
    {
        username=req.session.username;
        renderUserPage(req,res,username);
    } 
    else
     {
         res.render('userprofile', { title: 'userprofile',logged:0,
                    message:"You must be authenticated! ,please log in or register!"});
     }
});

///aici va fi randata pagina userului
////in functie de USERNAME
function renderUserPage(req,res,username)
{
    
    res.render('userprofile', { title: 'userprofile',logged:1,username:username});
    
};



router.get('/reviews',function(req,res)
{

    if(!req.session.username)
      {
          res.send('Must be authenticated!');
          return;
      }  
    var category=req.query.category;
    var username=req.query.username;
    var page=req.query.page;
    console.log('In user profile reviews category '+category);

    if(category==='electronics')
    {
        userReviews.getUserReviewsElectronics(req,res,username,page);

    }
    else if(category==='food') {
        userReviews.getUserReviewsFood(req, res, username, page);
    }

    else if(category=='hotels'){
        userReviews.getUserReviewsHotels(req,res,username,page);

    }

    
    
    
    
});

router.get('/export',function(req,res)
{
    var category=req.query.category;
     console.log(category);
    global.connection.execute('begin exporttables(:t); end;'
        ,[category], function (err,result){
        if(err){console.log(err.message);
                 res.send('Error');
                 return;}
        res.send('Succes!');
    }); 
});



router.get('/profileimg',function(req,res){
  
    var username=req.session.username;
    if(!username)
    {
        res.send("You Must be logged!");
        return;
    }
    if(!fileExists(__dirname.substring(0,__dirname.length-7)+'/public/images/profilesIMG/'+username+'.jpg'))
    {
        res.send("/images/profile.png");
        console.log("not   exisssssssstsssssss");
    }
    else
    {
        res.send("/images/profilesIMG/"+username+".jpg");
        console.log("exisssssssstsssssss");
        
    }
    
    
});

router.post('/uploadimg',upload.single('image'),function(req,res){
   
   var username=req.session.username;
   console.log('user: '+username);
   if(!username)
   {
       res.send('You must be logged!');
   }
   
   fs.readFile(req.file.path,function(err,data){
      var send=false;
      var newPath=__dirname.substring(0,__dirname.length-7)+'/public/images/profilesIMG/'+username+'.jpg';
      fs.writeFile(newPath,data,function(err){
         
         res.redirect('/userprofile');
         
          
      });
     
       
   });
   
    
});


router.get('/viewFollows',function(req,res){
   
   var username=req.session.username;
   var p=[];
   if(!username)
   {
       res.render('follows',{status:'Please Log In!',products:p});
       return;
   }
   
   global.connection.execute('select * from user_watched where username=:u',
                  [username],function(err1,result1){
                     
                     if(err1)
                     {
                         console.log(err.message);
                         res.render('follows',{status:'Err ocurred!',products:p});
                         return;
                     }
                     
                     var products=[];
                     for(var row in result1.rows)
                     {
                         var product=[];
                         product.category=result1.rows[row][1];
                         product.id=result1.rows[row][2];
                         product.image=result1.rows[row][3];
                         product.title=result1.rows[row][4];
                         products[row]=product;
                     }
                     
                     res.render('follows',{products:products,isLogged:1,username:username});
                     
                      
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

module.exports = router;

