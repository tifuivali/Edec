
var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');

responsetext='';
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('hotelpreferences', { title: 'hotel prefferences',logged:0,username:'Cineva'  ,response_text:responsetext});
});

var username='';
router.get('/', function(req, res, next) {
    if(req.session.username)
    {
        username=req.session.username;
        renderUserPage(req,res,username);
    }
    else
    {
        res.render('userprofile', { title: 'userprofile',logged:0,
            message:"You must be authenticated! ,please log in or register!"});
    }
});

username='usertest';
router.post('/', function(req, res,next){
    console.log(username);
    min_stars=req.body.min_stars;
    max_stars=req.body.max_stars;
    price_min=req.body.price_min;
    price_max=req.body.price_max;

    if (req.body.conferince_room === undefined) {
        conferince_room = 0;
    } else {
        conferince_room = 1;
    }

    if (req.body.disabled_people === undefined) {
        disabled_people = 0;
    } else {
        disabled_people = 1;
    }

    if (req.body.pet_friendly === undefined) {
        pet_friendly = 0;
    } else {
        pet_friendly = 1;
    }

    if (req.body.has_restaurant === undefined) {
        has_restaurant = 0;
    } else {
        has_restaurant = 1;
    }

    if (req.body.ferme === undefined) {
        ferme = 0;
    } else {
        ferme = 1;
    }

    if (req.body.playground === undefined) {
        playground = 0;
    } else {
        playground = 1;
    }

    console.log(min_stars);
    console.log(max_stars);
    console.log(conferince_room);
    console.log(price_min);
    console.log(price_max);
    console.log(disabled_people);
    console.log(pet_friendly);
    console.log(has_restaurant);
    console.log(ferme);
   console.log(playground);


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
                    "(:0, :1, :2, :3, :4, :5, :6, :7, :8, :9, :10 )",
                    [username, min_stars, max_stars, conferince_room, price_min, price_max, disabled_people, pet_friendly,
                        ferme, has_restaurant, playground],
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

                /*UPDATE table_name
                SET column1=value1,column2=value2,...
                WHERE some_column=some_value;*/

                global.connection.execute(

                    "UPDATE HOTEL_PREFERENCES SET "+
                    " min_stars=:0,max_stars=:1, conferince_room=:2,price_min=:3,price_max=:4,disabled_people=:5," +
                    "pet_friendly=:6,ferme=:7,has_restaurant=:8,playground=:9 where username=:10",
                    [min_stars, max_stars, conferince_room, price_min, price_max, disabled_people, pet_friendly,
                        ferme, has_restaurant, playground, username]
                    ,
                    { autoCommit: true },
                    function(err, result) {
                        if (err) {
                            res.render('hotelpreferences', {response_text2:"Erorr!"});
                            // callback(err.message)
                            return;
                        } 
                        res.render('hotelpreferences', {response_text2:"Data updated!"});
                        
                    });
            }
        });

    /*



     input(type="checkbox", name="playground")
     p
     button(type="submit") Insert data

    */
    res.render('hotelpreferences', { title: 'hotel prefferences',logged:0,username:'Cineva' ,response_text:responsetext});
});

module.exports = router;