
var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');

responsetext='';
username='user_test';
router.post('/', function(req, res,next) {
    console.log(username);
    country = req.body.country;
    city = req.body.city;
    console.log(country);
    console.log(city);
    var response = '';
    var reviews=[];
    var types_hotel=req.query.types_hotel;

    var type_hotel=types_hotel.substring(0,types_hotel.length-9);
    console.log(type_hotel);



    // global.connection.execute('select * from pref_type_hotel where username=:u and type_hotel=:t'
    //     ,[username,type_hotel], function (err,result){
    //         if(err){console.log(err.message);
    //             res.send('Error');
    //             return;}
    //         if(result.rows.length<=0)
    //         {
    //             global.connection.execute(
    //
    //                 "INSERT INTO HOTEL_PREFERENCES "+
    //                 " VALUES "+
    //                 "(:0, :1, :2, :3, :4, :5, :6, :7, :8, :9, :10 )",
    //                 [username, min_stars, max_stars, conferince_room, price_min, price_max, disabled_people, pet_friendly,
    //                     ferme, has_restaurant, playground],
    //                 { autoCommit: true  },
    //                 function(err, result) {
    //                     if (err) {
    //                         console.error("insert2", err.message);
    //                         // callback(err.message)
    //                     } else {
    //                         console.log("Rows inserted " + result.rowsAffected);
    //
    //                     }
    //                 });
    //
    //         }

});
module.exports = router;

