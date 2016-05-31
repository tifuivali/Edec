var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var amazon = require('amazon-product-api');
var jsdom = require("jsdom");
var client = amazon.createClient({
  awsId: "AKIAI53H7PGMNN4CPO3A",
  awsSecret: "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",
  awsTag: "e006a-21"
});



router.get('/',function(req,res){
   
    res.send("Salutari"); 
});



router.get('/insertE',function(req,res){
   
    
  client.itemSearch({
   Keywords:"Love",
   ItemPage:1,
   SearchIndex:'Books',
   ResponseGroup:'ItemAttributes'
  
}, function(err, results, response) {
  if (err) {
     res.send(err);
  } else {
   
    res.send(results);
    
    
   
  }
});

});

module.exports=router;