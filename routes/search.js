
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
    keyword=keyword.toUpperCase()+'%';
     global.connection.execute('select * from electronics where upper(model_name) like :k',
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
            
            product.title=result.rows[row][2];
            product.description=result.rows[row][6];
            product.seller=result.rows[row][8];
            products[row]=product;
        }
          
          res.render('templates/bodysearch',{products:products});
      }); 
};

module.exports=router;