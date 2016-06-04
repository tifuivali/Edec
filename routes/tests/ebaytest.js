var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');
var ebay = require('ebay-api');

var params = {
  keywords: ["LG"],
  paginationInput: {
    entriesPerPage: 500
  },
}

router.get('/',function(req,res){
    
    var keywords=req.query.keywords;
    var keys=keywords.split(' ');
    params.keywords=keys;
    ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsByKeywords',
    appId: 'Colibaba-EDEC-PRD-b90ed7b6b-d626bcda',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
    params: params,
    parser: ebay.parseResponseJson    // (default)
  },
  // gets all the items together in a merged array
  function itemsCallback(error, itemsResponse) {
    if (error){
    res.send(error);
    return;
    }
    

    var items = itemsResponse.searchResult.item;

    console.log('Found', items.length, 'items');
   res.send(items);
    
    for (var i = 0; i < items.length; i++) {
      var id=items[i].itemId;
      var title=items[i].title;
      var img=items[i].galleryURL;
      var price=items[i].sellingStatus.currentPrice.amount;
    global.connection.execute('begin insert into electronics(product_id,title,image,price) values(:id,:t,:i,:p); commit; end;',
     [id,title,img,price],function(err,result){
         
         if(err){console.log(err.message);}
         
         console.log('inserted..');
         
     });
      
    }  
  }
);
});


module.exports = router;
