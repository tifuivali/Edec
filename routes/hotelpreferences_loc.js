
var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');



router.post('/', function(req, res,next) {

   var username=req.session.username;
   var country=req.body.country;
   var  city=req.body.city;
   var responsetext='';
    console.log(country);
    console.log(city);
    var response='';
     var bindVars =
   {
      username:username,
      country:country,
      city:city,
      response: { dir: oracledb.BIND_OUT }
   };
    console.log('inserting '+username);
    global.connection.execute(
    "BEGIN insert_location_pref(:username,:country,:city,:response); END;",
        bindVars,
        function (err, result)
        {

            if (err) { console.error(err.message);
                res.render('hotelpreferences', { status:'Eror ocurred',title: 'hotelpreferences',logged:1,username:username
                    });
                return;
            }
            console.log('inserted '+result.outBinds.response);
            if(result.outBinds.response.trim()=='inserted'){
                var responsetext='Values inserted'
                console.log("Hotel pref location!!!!: "+result.outBinds.response.trim());

                
            }
            else{
                var responsetext='Values canot be inserted!';
                console.log("Hotel pref location!!!!: "+result.outBinds.response.trim());
            }
          res.render('hotelpreferences', { title: 'hotel prefferences',logged:1,username:username,response_text:responsetext });


        });

  
});

module.exports = router;
