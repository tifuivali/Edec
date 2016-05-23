
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


router.get('/unloged/negativeReviews',function(req,res){
    var category=req.query.category;    
    global.connection.execute('select * from ( select * from '+category+' order by down_votes desc) where rownum<5'
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
        var reviews=[];
          for(var row in result.rows)
                {
                 var review=[];
                 var title=category.substring(0,category.length-9);
                 review.title=title+' Review';
                 review.body=result.rows[row][5];
                 review.upVotes=result.rows[row][6];
                 review.downVotes=result.rows[row][7];
                 reviews[row]=review;
                 }
               // console.log(reviews);
              res.render('components/review',{reviews:reviews});                       
                                 
                                  
        });
                               
    
});


router.get('/unloged/pozitiveReviews',function(req,res){
    var category=req.query.category;    
    global.connection.execute('select * from ( select * from '+category+' order by up_votes desc) where rownum<5'
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
        var reviews=[];
          for(var row in result.rows)
                {
                 var review=[];
                 var title=category.substring(0,category.length-9);
                 review.title=title+' Review';
                 review.body=result.rows[row][5];
                 review.upVotes=result.rows[row][6];
                 review.downVotes=result.rows[row][7];
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
      viewUnLoggedPage();
  }
  else
  res.render('indexx', {name:'Val',text_test:'Lorem Ipsum is simply dummy ' +
  'text of the printing and typesetting industry. ' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry.' +
  'text of the printing and typesetting industry. ',logged:isLogged,username:user});
      }); 
});


function viewUnLoggedPage()
{
    res.render('indexx',{logged:0});
}

module.exports = router;