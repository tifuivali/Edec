
var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');

responsetext='';
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('restaurantpref', { title: 'restaurant prefferences',logged:0,username:'Cineva'  ,response_text:responsetext});
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

    if (req.body.vegetarian_food === undefined) {
        vegetarian_food = 0;
    } else {
        vegetarian_food = 1;
    }

    if (req.body.vegan_food === undefined) {
        vegan_food = 0;
    } else {
        vegan_food = 1;
    }

    if (req.body.dietetic_food === undefined) {
        dietetic_food = 0;
    } else {
        dietetic_food = 1;
    }


    console.log(min_stars);
    console.log(max_stars);
    console.log(vegetarian_food);
    console.log(vegan_food);
    console.log(dietetic_food);



    global.connection.execute('select * from restaurant_preferences where username=:u'
        ,[username], function (err,result){
            if(err){console.log(err.message);
                res.send('Error');
                return;}
            if(result.rows.length<=0)
            {
                global.connection.execute(

                    "INSERT INTO restaurant_preferences "+
                    " VALUES "+
                    "(:0, :1, :2, :3, :4, :5)",
                    [username, min_stars, max_stars, vegetarian_food, vegan_food, dietetic_food],
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

                    "UPDATE restaurant_preferences SET "+
                    " min_stars=:0,max_stars=:1, vegetarian_food=:2,vegan_food=:3,dietetic_food=:4 where username=:5",
                    [min_stars, max_stars, vegetarian_food, vegan_food, dietetic_food, username]
                    ,
                    { autoCommit: true },
                    function(err, result) {
                        if (err) {
                            console.error("UPDATE", err.message);
                            // callback(err.message)
                        } else {
                            console.log("Rows UPDATED " + result.rowsAffected);

                        }
                    });
            }
        });

    /*



     input(type="checkbox", name="playground")
     p
     button(type="submit") Insert data

     */
    res.render('restaurantpref', { title: 'restaurant prefferences',logged:0,username:'Cineva' ,response_text:responsetext});
});

module.exports = router;
