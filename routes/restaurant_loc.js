
var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');

responsetext='';
username='user_test';
router.post('/', function(req, res,next) {
    console.log(username);
    country=req.body.country;
    city=req.body.city;
    console.log(country);
    console.log(city);
    var response;

    global.connection.execute(
        "BEGIN insert_hotel_pref.insert_restaurant(:0,:1,:2,:response); END;",
        [username, country,city,response],
        function (err, result)
        {
            if (err) { console.error(err.message);
                res.render('signup', { status:'Eror ocurred',title: 'sign up',logged:0,username:usernameToSend
                });
                return;
            }
            if(result.outBinds.response=='inserted'){
                responsetext='Values inserted'

            }else{
                responsetext='Error ';
            }

        });

    res.render('restaurantpref', { title: 'restaurant prefferences',logged:0,username:'Cineva',response_text:responsetext});
});


module.exports = router;