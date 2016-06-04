
var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var fs=require('fs');
/* GET home page. */
isLogged=0;



router.get('/view',function (req, res, next) {
  // Update views
  req.session.views = (req.session.views || 0) + 1

  // Write response
  res.end(req.session.views + ' views')
});

router.get('/controversial',function(req,res) {
   
   var category=req.query.category;
   var maxrows=req.query.maxrows;
   var trim=req.query.trim;
   console.log('max'+maxrows);
   if(category==='electronics')
   {
        getControversalElectronics(req,res,maxrows,trim);
       return ;
   }
   /*
    else if(category==='cars')
   {
       getDesirableCars(req,res,maxrows,trim);
       return;
   }
   */
    
});


router.get('/unloged/mostdesirable',function(req,res) {
   
   var category=req.query.category;
   var maxrows=req.query.maxrows;
   var trim=req.query.trim;
   console.log('max'+maxrows);
   if(category==='electronics')
   {
       getDesirableElectronics(req,res,maxrows,trim);
       return ;
   }
    else if(category==='cars')
   {
       getDesirableCars(req,res,maxrows,trim);
       return;
   }
   
    
});

router.get('/unloged/mostundesirable',function(req,res) {
   
   var category=req.query.category;
   var maxrows=req.query.maxrows;
   var trim=req.query.trim;
   console.log('max'+maxrows);
   if(category==='electronics')
   {
       getUndesirableElectronics(req,res,maxrows,trim);
       return;
   }
   else if(category==='cars')
   {
       getDesirableCars(req,res,maxrows,trim);
       return;
   }
   
      
});



function getUndesirableElectronics(req,res,maxrows,trim)
{
    global.connection.execute('select * from (select * from ELECTRONICS_VIEW_UNDESIRABLE) where rownum<=:r',
                         [maxrows],function(err,result){
        
        if(err){
            console.log(err.message);
            res.send('Erorr ocured!');
            return;
        }
        
        if(result.rows.length<=0)
        {
            res.send('No results for this category!');
            return;
        }
       
       
       
        var products=[];
        for(var row in result.rows)
        {
            var product=[];
            product.title=result.rows[row][7];
            if(trim!='true')
            product.description=result.rows[row][4];
            else
              if(result.rows[row][4]) 
              product.description=result.rows[row][4].substring(0,30)+'...';
            product.seller=result.rows[row][5];
            product.picture=result.rows[row][9];
            product.category='electronics';
            products[row]=product;
        }
          
          res.render('components/productTop',{products:products});
      });  
                    
};


function getControversalElectronics(req,res,maxrows,trim)
{
     global.connection.execute('select * from (select * from ELECTRONICS_VIEW_CONTROVERSIAL) where rownum<=:r',
                         [maxrows],function(err,result){
        
        if(err){
            console.log(err.message);
            res.send('Erorr ocured!');
            return;
        }
        
        if(result.rows.length<=0)
        {
            res.send('No results for this category!');
            return;
        }
       
       
       
        var products=[];
        for(var row in result.rows)
        {
            var product=[];
            product.title=result.rows[row][7]
            if(trim!='true')
            product.description=result.rows[row][4];
            else
             if(result.rows[row][4]) 
             product.description=result.rows[row][4].substring(0,30)+'...';
            product.seller=result.rows[row][5];
            product.picture=result.rows[row][9]
            product.category='electronics';
            products[row]=product;
        }
          
          res.render('components/productTop',{products:products});
         
                                                     
        });
};

function getDesirableElectronics(req,res,maxrows,trim)
{
     global.connection.execute('select * from (select * from ELECTRONICS_VIEW_DESIRABLE) where rownum<=:r',
                         [maxrows],function(err,result){
        
        if(err){
            console.log(err.message);
            res.send('Erorr ocured!');
            return;
        }
        
        if(result.rows.length<=0)
        {
            res.send('No results for this category!');
            return;
        }
       
       
       
        var products=[];
        for(var row in result.rows)
        {
            var product=[];
            product.title=result.rows[row][7];
            if(trim!='true')
            product.description=result.rows[row][4];
            else
             if(result.rows[row][4]) 
             product.description=result.rows[row][4].substring(0,30)+'...';
            product.seller=result.rows[row][5];
            product.picture=result.rows[row][9];
            product.category='electronics';
            products[row]=product;
        }
          
          res.render('components/productTop',{products:products});
         
                                                     
        });
};

router.get('/unloged/negativeReviews',function(req,res){
    var category=req.query.category;    
    global.connection.execute('select * from ( select * from '+category+'_reviews order by down_votes desc) where rownum<5'
                              ,function(err,result){
        
        if(err){
            console.log(err.message);
            res.send('Erorr ocured!');
            return;
        }
        
        var body_index=3;
        var user_index=1;
        var upVotes_index=6;
        var downVotes_index=7;
        if(category==='electronics')
        {
            body_index=3;
            user_index=1;
            upVotes_index=6;
            downVotes_index=7;
        }
        else if(category==='hotels')
        {
            body_index=5;
            user_index=1;
            upVotes_index=6;
            downVotes_index=7;
        }
        else if(category==='books')
        {
            body_index=2;
            user_index=1;
            upVotes_index=6;
            downVotes_index=7;
        }
        else if(category=='restaurants')
        {
            body_index=5;
            user_index=1;
            upVotes_index=6;
            downVotes_index=7;
        }
        
        if(result.rows.length<=0)
        {
            res.send('No reviews for this category!');
            return;
        }                         
        var reviews=[];
          for(var row in result.rows)
                {
                 var review=[];
                 var username=result.rows[row][user_index];
                 var title=category.substring(0,category.length-9);
                 review.title=result.rows[row][user_index];
                 review.body=result.rows[row][body_index];
                 review.upVotes=result.rows[row][upVotes_index];
                 review.downVotes=result.rows[row][downVotes_index];
                 var usrimg='';
                 if(!fileExists(__dirname.substring(0,__dirname.length-7)+'/public/images/profilesIMG/'+username+'.jpg'))
                   usrimg='/images/profile.png';
                 else 
                   usrimg='/images/profilesIMG/'+username+'.jpg';
                 review.userimg=usrimg;  
                 reviews[row]=review;
                 }
               // console.log(reviews);
               
              res.render('components/review',{reviews:reviews});                       
                                 
                                  
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
};


router.get('/unloged/pozitiveReviews',function(req,res){
    var category=req.query.category;    
    global.connection.execute('select * from ( select * from '+category+'_reviews order by up_votes desc) where rownum<5'
                              ,function(err,result){
        
        if(err){
            console.log(err.message);
            res.send('Erorr ocured!');
            return;
        }
        
        if(result.rows.length<=0)
        {
            res.send('No reviews for this category!');
            return;
        }
        var body_index=3;
        var user_index=1;
        var upVotes_index=6;
        var downVotes_index=7;
        if(category==='electronics')
        {
            body_index=3;
            user_index=1;
            upVotes_index=6;
            downVotes_index=7;
        }
        else if(category==='hotels')
        {
            body_index=5;
            user_index=1;
            upVotes_index=6;
            downVotes_index=7;
        }
        else if(category==='books')
        {
            body_index=2;
            user_index=1;
            upVotes_index=6;
            downVotes_index=7;
        }
        else if(category=='restaurants')
        {
            body_index=5;
            user_index=1;
            upVotes_index=6;
            downVotes_index=7;
        }
        
        
                                 
        var reviews=[];
          for(var row in result.rows)
                {
                 var review=[];
                 var title=category.substring(0,category.length-9);
                 review.title=result.rows[row][user_index]
                 var username=result.rows[row][user_index];
                 if(username)
                  username.trim();
                 review.body=result.rows[row][body_index];
                 review.upVotes=result.rows[row][upVotes_index];
                 review.downVotes=result.rows[row][downVotes_index];
                 var usrimg='';
                 if(!fileExists(__dirname.substring(0,__dirname.length-7)+'/public/images/profilesIMG/'+username+'.jpg'))
                   usrimg='/images/profile.png';
                 else 
                   usrimg='/images/profilesIMG/'+username+'.jpg';
                 review.userimg=usrimg; 
                 reviews[row]=review;
                 }
               // console.log(reviews);
              res.render('components/review',{reviews:reviews});                       
                                 
                                  
        });
                               
    
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
    if (err) { res.render('index', { title: 'Express',conn:'erorr connection to db'}); return ; }
    global.connection=connection;
     
  //res.render('index', { title: 'Express',conn:"Conected!" });
  var user='';
  if(req.session)
  if(req.session.username)
  {
      user=req.session.username;
      console.log('user '+user);
      isLogged=1;
      viewLoggedPage(req,res,user);
  }
  else
    viewUnLoggedPage(req,res);
});
});

function viewUnLoggedPage(req,res)
{
    res.render('indexx',{logged:0});
}

function viewLoggedPage(req,res,username)
{
   res.render('indexx', {name:'Val',logged:isLogged,username:username});
  
};


router.get('/mostMatch',function(req,res){
   var username=req.session.username;
   var num=req.query.number;
   var trim=req.query.trim;
   if(!username)
   {
       res.send('You must be logged!');
       return;
   }
   global.connection.execute('select * from '+username+'_MOSTMATCH_ELECTRINICS where rownum<=:n',
   [num],function(err,result){
      
      if(err){
          res.send("Erorr ocurred!");
          console.log("Err get matched \n"+err.message);
          return;
      }
      
      var prds=[];
      for(var row in result.rows)
      {
          var product=[];
          product.title=result.rows[row][0];
          if(!trim)
           product.description=result.rows[row][3];
          else
            if(result.rows[row][3])
            product.description=result.rows[row][3].substring(0,40);
          product.seller=result.rows[row][1];
          product.image=result.rows[row][2];
          console.log(product.image);
          product.category='electronics';
          prds[row]=product;
      }
      
       res.render('components/productTop',{products:prds});
      
        
   });
    
});

router.get('/follow',function(req,res){
   
   var username=req.session.username;
   var category=req.query.category;
   var image=req.query.image;
   var title=req.query.title;
   var p=[];
   if(!username)
   {
       res.render('follows',{status:'Please Log In!',products:p});
       return;
   }
   
   global.connection.execute('begin follow(:u,:c,:img,:t); end;',
             [username,category,image,title],function(err,result){
             
                 if(err)
                 {
                     console.log(err.message);
                     res.render('follows',{status:'Err ocurred!',products:p,isLogged:1,username:username});
                     return;
                 }
             
                 res.redirect('/userprofile/viewFollows');
             
              
             });
    
});


router.get('/unfollow',function(req,res){
   
   var username=req.session.username;
   var product_id=req.query.product_id;
   var p=[];
   if(!username)
   {
       res.render('follows',{status:'Please Log In!',products:p});
       return;
   }
   
   global.connection.execute('begin delete from user_watched where username=:u and trim(upper(id_product))=trim(upper(:pid)); commit; end;',
     [username,product_id],function(err,result){
        
        if(err)
        {
             res.render('follows',{status:'Err ocured!',products:p});
              return;
        }
        
        res.redirect('/userprofile/viewFollows');
         
     });
   
    
});

module.exports = router;