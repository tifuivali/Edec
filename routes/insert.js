
var express=require('express');
var router=express.Router();
var amazon = require('amazon-product-api');
var client = amazon.createClient({
  awsId: "AKIAI53H7PGMNN4CPO3A",
  awsSecret: "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",
  awsTag: "e006a-21"
});
var oracledb = require('oracledb');

function insertProducts(req,res) {
      
      var key=req.query.keywords;
      var page=req.query.page;
      var con=testConn();
      searchAndInsertProduct(res,page,key,global.connection);
 };


router.get('/electronics',function(req,res){
  
 insertProducts(req,res);

});

router.get('/',function(req,res) {
   oracledb.getConnection(
  {
    user          : "edec",
    password      : "edec",
    connectString : "localhost/XE"
  },
  function(err, connection)
  {
     // res.send(prds[0].product_type);
    if (err) { res.render('insertElectronic', { status:err.message}); return ; }
    global.connection=connection;
     
      res.render('insertElectronic', { status:"Connected!"});
    }); 
})

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function searchAndInsertProduct(res,page,key,connection)
{
  client.itemSearch({
  keywords:key,    
  searchIndex: 'Electronics',
  itemPage:page
}, function(err, results, response) {
  if (err) {
     res.send(err);
  } else {
   // console.log(results);  // products 
   // res.send(results);
   var prds=[];
   for(var i=0;i<10;i++)
   {       
      var prod=new ElectronicProduct();
      var item=results[i];
      if(item)
      {if(item.DetailPageURL)
      prod.seller=item.DetailPageURL[0];
      var itemAttr=item.ItemAttributes[0];
      if(item.ASIN)
       prod.product_id=item.ASIN[0];
      if(itemAttr.ProductTypeName[0])
      {
         prod.product_type=itemAttr.ProductTypeName[0];
      }
      
      if(itemAttr.Model)
      {
         prod.model_name=itemAttr.Model[0];
      }
      if(itemAttr.Brand)
      {
          prod.brand=itemAttr.Brand[0];
      }
      if(itemAttr.OperatingSystem)
      {
         prod.operating_system=itemAttr.OperatingSystem[0];
      }
     if(itemAttr.TradeInValue)
     {
         if(itemAttr.TradeInValue[0])
           if(prod.price=itemAttr.TradeInValue[0].FormattedPrice)
            {
              var str=itemAttr.TradeInValue[0].FormattedPrice[0];
              prod.price=parseFloat(str.substring(1));
            }
            
     }
     
      if (itemAttr.Feature) {
          var desc = "";
          for (var j = 0; j < 10; j++) {
              if(itemAttr.Feature[j])
                desc += itemAttr.Feature[j];
          }
          prod.description = desc;
      }
      
      prod.display_size=0;
      if(itemAttr.Color)
      {
          prod.color=itemAttr.Color[0]; 
      }   
      prds[i]=prod;
      }
      else return; 
   }

     // res.send(prds[0].product_type);
     var errs;
    if (err) { console.error(err.message);res.send(err); return ; }
     for(var i=0;i<10;i++)
      {
      connection.execute(
      "begin insert into electronics_test values (:pt,:pi,:mn,:br,:os,:p,:des,:ds,:sel,:col,:pr); commit; end;",
      [prds[i].product_type,prds[i].product_id,prds[i].model_name,prds[i].brand,prds[i].operating_system,
       prds[i].price,prds[i].description,prds[i].display_size,prds[i].seller,prds[i].color,"processor"],  
      function(err, result)
      {
        if (err) {console.log('eroare are'+err.message); errs=err.message; return; }
        console.log("inserat...");
      });
      }
      if(errs)
      {
          res.send('<span>'+err+'span');
      }
      else        
         res.send(prds);
  
  }
  
});
}

function ElectronicProduct()
{
   this.product_type;
   this.product_id;
   this.model_name;
   this.brand;
   this.operating_system;
   this.price;
   this.description;
   this.display_size;
   this.seller;
   this.color;
};

function testConn()
{
   var connected=-1; 
    if(global.connection)
    {
        return 1;
    }
    else{
        console.log('fac o noua conexiune');
  oracledb.getConnection(
  {
    user          : "edec",
    password      : "edec",
    connectString : "localhost/XE"
  },
  function(err, connection)
  {
     // res.send(prds[0].product_type);
    if (err) {console.log(err.message);connected=0; return 0;  }
    global.connection=connection;
    connected=1;
    return 1;;
    }); 
    }
}

module.exports=router;