var express = require('express');
var router = express.Router();

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
    var reviews=[];
    var review=[];  
    global.connection.execute('select * from (select * from '+category+' where username=:u) where rownum<10'
        ,[username], function (err,result){
        if(err){console.log(err.message);
                 res.send('Error');
                 return;}
        if(result.rows.length<=0)
           res.send('No results.');
        else   
          {
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
              res.render('components/userReviews',{reviews:reviews});
          }
    });
});

module.exports = router;

