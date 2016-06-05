
var express=require('express');
var router=express.Router();
var oracledb=require('oracledb');


router.get('/',function(req,res)
{
   var nume=req.query.keyword;
   searchElectronicProduct(req,res,nume);
   
    
});


function searchElectronicProduct(req,res,keyword)
{
    keyword='%'+keyword.toUpperCase()+'%';
     global.connection.execute('select * from (select * from electronics where upper(title) like :k) where rownum<40',
                         [keyword],function(err,result){
        
        if(err){
            console.log(err.message);
            res.send('Erorr ocured!');
            return;
        }
        
        if(result.rows.length<=0)
        {
            res.send('No results!');
            return;
        }
       
       
       
        var products=[];
        for(var row in result.rows)
        {
            var product=[];
            
            product.title=result.rows[row][9];
            product.link=result.rows[row][7];
            product.picture=result.rows[row][11];
            product.category='electronics';
            products[row]=product;
        }
          
          res.render('templates/bodysearch',{products:products});
      }); 
};

module.exports=router;