var express = require('express');
var fs = require('fs');
var router = express.Router();
var oracledb=require('oracledb');

/* GET home page. */
var usernameToSend='';
var logged=1;
router.get('/:type/:productId', function(req, res, next) {
    var type = req.params.type;
    var productId = req.params.productId;
    var username=req.session.username;
    if(!username)
      logged=0;
    else
     {
         logged=1;
         usernameToSend=username;
     }  
    renderPage(res, productId, type);
});
function renderPage(res, productId, type,status) {
    getProductData(type,productId,function(product){
            getProductReviews(type,productId,function(product){
                    res.render('product', { title: 'Product',status:status, logged : logged, username: usernameToSend, product: product ,type:type});
                },
                function(){
                    res.render('error');
                }, product)
        },
        function(){
            res.render('error');
        });
}

function getProductData(type, id, success, fail){
    var query = "";
    switch(type){
        case "food": query = "SELECT food_id, food_name, short_description as description FROM food WHERE food_id=:fId"; break;
        case "hotels": query = "SELECT id_hotel,name_hotel,country||' '||city||' '||description as description," +
            "thumb_nail_url as image FROM hotels WHERE id_hotel=:hId"; break;
        case "electronics": query = "SELECT product_id,title" +
            ",description,image from electronics where trim(upper(product_id))=trim(upper(:eId))"; break;
    }
    
    console.log(query);
    global.connection.execute(query,[id],function(err, response){
        if(err)
        {
            console.log("Error on running query \""+ query + "\" in product.js + id "+ id );
            if(fail)
                fail();
            return;    
        }
        else
        {
            if(response.rows.length<=0)
            {
                console.log('Not rows results Prod data! '+response.rows.length);
                fail();
                return;
            }
            else
            {
                var product;
                console.log("Let's see the response of query :D--> "+type+' '+response.rows[0][0])
                switch(type){
                    case "food": product = mapResponseToFood(response.rows[0]); break;
                    case "hotels": product = mapResponseToHotels(response.rows[0]); break;
                    case "electronics": product = mapResponseToElectronics(response.rows[0]); break;
                }
                product.id=id;
                success(product);
            }
        }
    })
}

function getProductReviews(type, id, success, fail, product){
    var query = "";

    switch(type){
        case "food": query = "select username,review,up_votes,down_votes,review_id from reviewsfood WHERE food_id=:fId"; break;
        case "hotels": query = "select username,review,up_votes,down_votes,id_review from hotels_reviews WHERE id_hotel=:hId"; break;
        case "electronics": query = "select username,review,up_votes,down_votes,id_review from electronics_reviews where trim(upper(product_id))=trim(upper(:eId))"; break;
    }
    global.connection.execute(query,[id],function(err, response){
        if(err)
        {
            console.log("Error on running query \""+ query + "\" in product.js  "+id);
            if(fail)
                fail();
                return;
        }
        else
        {
            if(response.rows.length<=0)
            {
                product.reviews=[];
                success(product);
            }
            else
            {
                if(!product)
                    product = {};
                console.log("Let's see the response of query :D--> "+response.rows[0][0]);
                product.reviews = mapResponseToReviews(response.rows);
                success(product);
            }
        }
    })
}

function mapResponseToFood(response){
    var food = {
        id : response[0],
        name : response[1],
        description : response[2]
    }
    return food;
}

function mapResponseToHotels(response){
    var hotel = {
        id : response[0],
        name : response[1],
        description : response[2],
        image : response[3]
    }
    return hotel;
}

function mapResponseToElectronics(response){
    var electronics = {
        id : response[0],
        name : response[1],
        description : response[2],
        image : response[3]
    }
    return electronics;
}

function mapResponseToReviews(response){
    return response.map(function(value){
        var url=""
        if(!fileExists(__dirname.substring(0,__dirname.length-7)+'/public/images/profilesIMG/'+value[0]+'.jpg'))
        {
            url="/images/profile.png";
        }
        else
        {
            url="/images/profilesIMG/"+value[0]+".jpg";
        }
        return {
            userImg : url,
            userName : value[0],
            reviewMessage : value[1],
            upvotes : value[2],
            downvotes : value[3],
            id : value[4]
        }
    });
}

router.post("/:type/:productId/:reviewId/vote/:vote",function(req,res,next){
    var type=req.params.type;
    var prodId=req.params.prodId;
    var reviewId=req.params.reviewId;
    var vote=req.params.vote;

    voteProduct(reviewId,type,vote,function(myResult){
        console.log("ok");
        res.send(myResult);
    },function(){
        console.log("it's not ok");
        res.send(0);
    });
});


router.post('/addReview',function(req,res){
   
   
   var status='';
   var username=req.session.username;
  
   
   var review=req.body.review;
   var id=req.query.id;
   var category=req.query.category;
   console.log('IDDDDD:'+id+' CAT:'+category);
   if(!username)
   {
      renderPage(res,id,category,'You must be logged!');
      return;
   }
   global.connection.execute('begin insertRevieww(:cat,:user,:p_id,:rev); end;',
    [category,username,id,review],function(err,result){
       
       if(err)
       {
          console.log(err.message); 
          renderPage(res,id,category,'Error ocurred!');
          return;
       }
       
       renderPage(res,id,category);
      
        
    });
   
    
});


function voteProduct(idReview,type,vote,success,fail) {

    if (vote == 1 || vote == -1) {
        console.log("BEGIN :ret := voteaza("+type+","+idReview+","+vote+","+usernameToSend+"); END;")
        global.connection.execute(
            "BEGIN :ret := voteaza(:type,:idReview,:vote,:usernameToSend); END;",
            { ret: { dir: oracledb.BIND_OUT, type: oracledb.number, maxSize: 10 } ,
              type: { val: type, dir: oracledb.BIND_IN, type: oracledb.STRING , maxSize: 100 } ,
              idReview: { val:idReview, dir: oracledb.BIND_IN, type: oracledb.STRING , maxSize: 1000 } ,
              vote: { val: vote, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 } ,
              usernameToSend: { val: usernameToSend, dir: oracledb.BIND_IN, type: oracledb.STRING , maxSize: 1000 }
            },
            function (err, result)
            {

                if (err) {
                    console.log(err.message);
                    if(fail){
                        fail();
                    }
                }
                else{
                    console.log(result.outBinds);
                    success(result.outBinds.ret);
                }

            });

    }
}

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