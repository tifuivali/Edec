
var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');
var newExpediaHotels=require('./populate_hotels/newExpediaHotels');
var insertHotelLocPref=require('./controller/insertHotelLocPref');

var username='';
responsetext='';
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('user pref page');
    if(req.session.username)
    {
        username=req.session.username;
        res.render('hotelpreferences', { title: 'hotel preferences',logged:1,username:username  ,response_text:responsetext});
    }
    else
    {
        res.render('signin', { title: 'signin',logged:0,
            message:"You must be authenticated! ,please log in or register!"});
    }
   });
router.get('/deleteLocation', function(req, res) {
    
    console.log('delete location');
    var id= req.query.id;
    var username=req.session.username;
    if(!username)
    {
        res.send('You must be logged!');
        return;
    }
    global.connection.execute('delete from preference_hotels_location where username=:username and location_id=:id',
        [username,id],{ autoCommit: true  },
        function(err,result){

            if(err){
                res.send("Erorr ocurred!");
                console.log("Err get matched \n"+err.message);
                return;
            }


            var locations=[];
            // for(var row in result.rows)
            // {
            //     var location=[];
            //     location.loc=result.rows[row][0]+" "+result.rows[row][1];
            //
            //     location.id = result.rows[row][2];
            //     locations[row]=location;
            // }

            res.render('components/hotelsPref/hotelsLoc',{locations:locations});


        });


});


router.get('/location',function(req,res){
    var username=req.session.username;
    if(!username)
    {
        res.send('You must be logged!');
        return;
    }
    console.log("location");
    global.connection.execute('select city,country, l_p.location_id from preference_hotels_location p_h' +
    ' join location_preference l_p on p_h.location_id=l_p.location_id where username=trim(:username)',
        [username],function(err,result){


            console.log("got response"+ result.rows.length);
            if(err){
                res.send("Erorr ocurred!");
                console.log("Err get matched \n"+err.message);
                return;
            }

            var locations=[];
            for(var row in result.rows)
            {
                var location=[];
                location.loc=result.rows[row][0]+" "+result.rows[row][1];
                
                location.id = result.rows[row][2];
                locations[row]=location;
            }

            res.render('components/hotelsPref/hotelsLoc',{locations:locations,foundMatch:(result.rows.length>0)});


        });

});
router.get('/expediaSearch',function(req,res) {
    var username = req.session.username;
    var city = req.query.city;
    var country = req.query.country;
    if (!username) {
        res.send('You must be logged!');
        return;
    }
        console.log('started');
    newExpediaHotels.get_hotels(city,country,req,res);


    
    
}
);

router.get('/peferences',function(req,res){
    var username=req.session.username;
    console.log("!!!!username pref "+username);
    if(!username)
    {
        res.send('You must be logged!');
        return;
    }
    console.log("preferences!!!!!1");
    var preferences = [];
    var pref=[];
    var row = 0;
    global.connection.execute('select * from hotel_preferences where username=:username',
        [username],function(err,result){

            if(err){
                res.send("Erorr ocurred!");
                console.log("Err get matched \n"+err.message);
                return;
            }
            if(result.rows.length>0) {


                for(var tablerow in result.rows)
                {
                    var pref=[];
                         console.log ("user pref: "+result.rows[tablerow]);
                        if (result.rows[tablerow][2] !== null) {
                            preferences[row] = "Maximum number of stars: " + result.rows[tablerow][2];
                             
                            row++;
                        }
                        if (result.rows[tablerow][1] !== null) {
                            preferences[row] = "Minimum number of stars: " + result.rows[tablerow][1];
                            
                            row++;
                        }
                        if (result.rows[tablerow][4] !== null) {
                            preferences[row] = "Maximum price " + result.rows[tablerow][4];
                            
                            row++;
                        }

                        if (result.rows[tablerow][3] === 1) {
                            preferences[row] = "Conference room "
                            row++;
                        }

                        if (result.rows[tablerow][5] === 1) {
                            preferences[row] = "Accessibility"
                            row++;
                        }

                        if (result.rows[tablerow][6] === 1) {
                            preferences[row] = "Pet friendly"
                            row++;
                        }

                        if (result.rows[tablerow][7] === 1) {
                            preferences[row] = "Has restaurant"
                            row++;
                        }

                        if (result.rows[tablerow][8] === 1) {
                            preferences[row] = "Has playground"
                            row++;
                        }
                        if (result.rows[tablerow][9] === 1) {
                            preferences[row] = "Has non smoking rooms"
                            row++;
                        }

                        if (result.rows[tablerow][10] === 1) {
                            preferences[row] = "Has smoking rooms"
                            row++;
                        }

                        if (result.rows[tablerow][11] === 1) {
                            preferences[row] = "Has free internet"
                            row++;
                        }

                        if (result.rows[tablerow][12] === 1) {
                            preferences[row] = "Free cancellation"
                            row++;
                        }
                        if (result.rows[tablerow][13] === 1) {
                            preferences[row] = "Free parking"
                            row++;
                        }
                        if (result.rows[tablerow][14] === 1) {
                            preferences[row] = "Swimming pool"
                            row++;
                        }
                        }
                    }
            else{
                console.log("No values!");
                preferences[row]="No values!";
            }
            res.render('components/hotelsPref/hotelsPref',{preferences:preferences});


        });

});




router.post('/', function(req, res,next){
    console.log(username);

    if (req.body.min_stars === undefined || (req.body.min_stars<0 && req.body.min_stars>5) ){
        var min_stars = null;
    } else {        
            var min_stars = req.body.min_stars;
         
    }

    if (req.body.max_stars === undefined || (req.body.max_stars<0 && req.body.max_stars>5) ){
        var max_stars = null;
    } else {
        {
            var max_stars = req.body.max_stars;
        }
    }
    if (max_stars<min_stars){
        max_stars=0;
        min_stars=0;
    }

    if (req.body.price_max === undefined) {
        var price_max = null;
    } else {
        var price_max = 1;
    }


    var price_max=req.body.price_max;

    if (req.body.conferince_room === undefined) {
        var conferince_room = 0;
    } else {
        var conferince_room = 1;
    }

    if (req.body.disabled_people === undefined) {
        var disabled_people = 0;
    } else {
        var disabled_people = 1;
    }

    if (req.body.pet_friendly === undefined) {
        var pet_friendly = 0;
    } else {
        var pet_friendly = 1;
    }

    if (req.body.has_restaurant === undefined) {
        var has_restaurant = 0;
    } else {
        var has_restaurant = 1;
    }


    if (req.body.playground === undefined) {
        var playground = 0;
    } else {
        var playground = 1;
    }

    if (req.body.has_non_smoking === undefined) {
        var has_non_smoking = 0;
    } else {
        var has_non_smoking = 1;
    }

    if (req.body.has_smoking === undefined) {
        var has_smoking = 0;
    } else {
        var has_smoking = 1;
    }

    if (req.body.free_internet === undefined) {
        var free_internet = 0;
    } else {
        var free_internet = 1;
    }

    if (req.body.free_cancelation === undefined) {
        var free_cancellation = 0;
    } else {
        var free_cancellation = 1;
    }

    if (req.body.free_parking === undefined) {
        var free_parking = 0;
    } else {
        var free_parking = 1;
    }

    if (req.body.swimming_pool === undefined) {
        var swimming_pool = 0;
    } else {
        var swimming_pool = 1;
    }



    console.log(min_stars);
    console.log(max_stars);
    console.log(conferince_room);

    console.log(price_max);
    console.log(disabled_people);
    console.log(pet_friendly);
    console.log(has_restaurant);

    console.log(playground);

    /*
     USERNAME
     MIN_STARS
     MAX_STARS
     CONFERINCE_ROOM
     PRICE_MAX
     DISABLED_PEOPLE
     PET_FRIENDLY
     HAS_RESTAURANT
     PLAYGROUND
     HAS_NON_SMOKING
     HAS_SMOKING
     FREE_INTERNET
     FREE_CANCELLATION
     FREE_PARKING
     SWIMMING_POOL
     */


    global.connection.execute('select * from hotel_preferences where username=:u'
        ,[username], function (err,result){
            if(err){console.log(err.message);
                res.send('Error');
                return;}
            if(result.rows.length<=0)
            {
                global.connection.execute(

                    "INSERT INTO HOTEL_PREFERENCES "+
                    " VALUES "+
                    "(:0, :1, :2, :3, :4, :5, :6, :7, :8, :9, :10,:11,:12,:13,:14 )",
                    [username, min_stars, max_stars, conferince_room, price_max, disabled_people, pet_friendly,
                        has_restaurant, playground,has_non_smoking,has_smoking,free_internet,free_cancellation,free_parking,swimming_pool],
                    { autoCommit: true  },
                    function(err, result) {
                        if (err) {
                            console.error("insert2", err.message);
                            // callback(err.message)
                        } else {
                            console.log("Rows inserted " + result.rowsAffected);

                        }
                    });

            }
            else{


                global.connection.execute(
                    "UPDATE HOTEL_PREFERENCES SET "+
                    " min_stars=:0,max_stars=:1, conferince_room=:2,price_max=:3,disabled_people=:4," +
                    "pet_friendly=:5,has_restaurant=:6,playground=:7,has_non_smoking=:8, has_smoking=:9," +
                    "free_internet=:10,free_cancellation=:11,free_parking=:12,swimming_pool=:13 where username=:14",
                    [min_stars, max_stars, conferince_room, price_max, disabled_people, pet_friendly,
                        has_restaurant, playground,has_non_smoking,has_smoking,free_internet,free_cancellation,free_parking,swimming_pool, username]
                    ,
                    { autoCommit: true },
                    function(err, result) {

                        if (err) {
                            res.render('hotelpreferences', {response_text2:"Error:"+err.message});
                            // callback(err.message)
                            return;
                        }
                        res.render('hotelpreferences', {response_text2:"Data updated!"});
                        console.log('Data updated!');

                    });
            }
        });


    // res.render('hotelpreferences', { title: 'hotel preferences',logged:1,username:username ,response_text:responsetext});
});



module.exports = router;