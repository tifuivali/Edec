
var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var fs=require('fs');
/* GET home page. */
isLogged=0;
var mostMatched = require('./controller/mostMatchedCoroller');
var youMightLike = require('./controller/youMightLikeController');
var stayAwayFrom = require('./controller/stayAwayFromController');
var controversial = require('./controller/controversialController');
var mostDesirable = require('./controller/mostDesirableController');
var mostUndesirable = require('./controller/undesirableController');
var reviewShowing = require('./controller/reviewShowing');
var populateHotels = require('./populate_hotels/newExpediaHotels');

oracledb.autoCommit = true;


router.get('/view',function (req, res, next) {
  // Update views
  req.session.views = (req.session.views || 0) + 1

  // Write response
  res.end(req.session.views + ' views')

});


router.get('/logged/mostMatcedToYou',function (req, res) {
    var user=req.session.username;
    var category=req.query.category;
    console.log("most matched to you.. "+category);
    if(category==='food')
    {
        mostMatched.getMostMatchedToYouFood(req,res,user);
        return;
    }
    else if(category=='hotels'){
        mostMatched.getMostMatchedToYouHotels(req,res,user);
        return;
    }

});

router.get('/logged/stayawayfrom',function (req, res) {
    var user=req.session.username;
    var category=req.query.category;
    console.log("you might like "+category);
   if(category==='food')
    {
        stayAwayFrom.getStayAwayFromFood(req,res,user);
        return;
    }
    else if(category=='hotels'){
        stayAwayFrom.getStayAwayFromHotels(req,res,user);
        return;
    }

});

router.get('/logged/youmightlike',function (req, res) {
    var user=req.session.username;
    var category=req.query.category;
    console.log("you might like "+category);
    if(category==='food')
    {
        youMightLike.getYouMightLikeFood(req,res,user);
        return;
    }
    else if(category=='hotels'){
        youMightLike.getYouMightLikeHotels(req,res,user);
        return;
    }

});

router.get('/controversial',function(req,res) {

    var category=req.query.category;
    var maxrows=req.query.maxrows;
    var trim=req.query.trim;
    console.log('controversial category '+category);
    if(category==='electronics')
    {
        getControversalElectronics(req,res,maxrows,trim);
        return ;
    }
    else if(category==='hotels')
    {
        controversial.getControversalHotels(req,res);
        return ;
    }
    else if(category==='food')
    {
        controversial.getControversalFood(req,res);
        return ;
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
   else if(category==='food')
   {
       mostUndesirable.getUndesirableFood(req,res,maxrows,trim);
       return;
   }
    else if(category=='hotels'){
       mostUndesirable.getUndesirableHotels(req,res,maxrows);
       return;
   }
   
    
});

router.get('/unloged/mostdesirable',function(req,res) {

    var category=req.query.category;
    var maxrows=req.query.maxrows;
    var trim=req.query.trim;
    console.log('max'+maxrows);
    if(category==='electronics')
    {
        getDesirableElectronics(req,res,maxrows,trim);
        return;
    }
    else if(category==='food')
    {
        mostDesirable.getDesirableFood(req,res,maxrows,trim);
        return;
    }
    else if(category=='hotels'){
        mostDesirable.getDesirableHotels(req,res,maxrows);
        return;
    }


});


router.get('/unlogged/mostmatched',function(req,res) {

    var category=req.query.category;
    var maxrows=req.query.maxrows;

    if(category==='hotels')
    {
        mostMatched.getMostMatchedtoHotels(req,res,maxrows);
        return;
    }else if(category==='food'){
        mostMatched.getMostMatchedtoFood(req,res,maxrows);
        return; 
    }



});



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

    if (category==='hotels') {
        reviewShowing.getHotelReviews(category,res,0);
         }


    else if (category === 'electronics') {
        reviewShowing.getElectronicsReviews(category,res,0);

    }
    else if (category === 'food') {


        reviewShowing.getFoodReviews(category,res,0);
    }
                               
    
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

  
router.get('/unloged/pozitiveReviews',function(req,res) {
    var category = req.query.category;

    if (category === 'hotels') {
        reviewShowing.getHotelReviews(category,res,1);

    }
    else if (category === 'electronics') {
        reviewShowing.getElectronicsReviews(category,res,1);
    }
    else if (category === 'food') {


        reviewShowing.getFoodReviews(category,res,1);
    }


});




router.get('/', function(req, res) {

   console.log("Obtaining DB connection");
   oracledb.getConnection(
  {
    user          : "edec",
    password      : "edec",
    connectString : "79.112.123.254/XE" 
  },
  function(err, connection)
  {
      console.log(" DB connection obtained");
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


   console.log('home page!!!!!!!!!!!!!!');
  

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
          product.picture=result.rows[row][2];
          console.log(product.picture);
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