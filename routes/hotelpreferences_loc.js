
var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');


username='user_test';
router.post('/', function(req, res,next) {
   console.log(username);
   var user_name=req.session.username;
   var country=req.body.country;
   var  city=req.body.city;
   var responsetext='';
    console.log(country);
    console.log(city);
    var response='';
     var bindVars = 
   {
      user:user_name  ,
      country:country,
      city:city,
      response: { dir: oracledb.BIND_INOUT }
   }; 
    global.connection.execute(
    "BEGIN insert_hotel_pref.insert_hotel(:user,:country,:city,:response); END;",
        bindVars,
        function (err, result)
        {
            if (err) { console.error(err.message);
                res.render('hotelpreferences', { status:'Eror ocurred',title: 'sign up',logged:0,username:usernameToSend
                    });
                return;
            }
            if(result.outBinds.response.trim()=='inserted'){
                responsetext='Values inserted'
                console.log(responsetext);
                
            }
            else{
                responsetext='Values canot be inserted!';
                console.log(responsetext);
            }
          res.render('hotelpreferences', { title: 'hotel prefferences',logged:0,username:'Cineva',response_text:responsetext });
         

        });

  
});

module.exports = router;