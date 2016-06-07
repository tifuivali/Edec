
var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');

var username='Balooony';
responsetext='';
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('user pref page');
    if(!req.session.username)
    {
        res.render('signin', { title: 'signin',logged:0,
            message:"You must be authenticated! ,please log in or register!"});
    }
    username=req.session.username;
    
    var preferences = {};
    var pref=[];
    var row = 0;
    global.connection.execute('select * from preferencesfood where username=:username',
        [username],function(err,result){

            if(err){
                console.log("Err get matched \n"+err.message);
                return;
            }
            if(result.rows.length>0) {
                var pref={};
                if (result.rows[0][1] !== null) {
                    console.log("received preferences" + result.rows[0][1])
                    preferences.min_nitrogen = result.rows[0][1];
                }
                if (result.rows[0][2] !== null) {
                    preferences.max_hidrogen = result.rows[0][2];
                }

                //carbohydrate_factor_min
                if (result.rows[0][3] !== null) {
                    preferences.min_carbohydrate = result.rows[0][3];
                }
                if (result.rows[0][4] !== null) {
                    preferences.max_carbohydrate = result.rows[0][4];
                }
                //fat_factor_min
                if (result.rows[0][5] !== null) {
                    preferences.min_fat = result.rows[0][5];
                }
                if (result.rows[0][6] !== null) {
                    preferences.max_fat = result.rows[0][6];
                }
                //protein_factor_min
                if (result.rows[0][7] !== null) {
                    preferences.min_protein = result.rows[0][7];
                }
                if (result.rows[0][8] !== null) {
                    preferences.max_protein = result.rows[0][8];
                }
            }
            console.log(preferences);
            res.render('foodpreferences', { title: 'food preferences',logged:1,username:username  ,response_text:responsetext, preferences:preferences});
        });
});

//primeste ca parametri preferintele unui utilizator si le salveaza in baza de date
function savePreferences(username, nitrogen_to_protein_min, nitrogen_to_protein_max,
                         carbohydrate_factor_min, carbohydrate_factor_max,
                         fat_factor_min, fat_factor_max,protein_factor_min, protein_factor_max){
    global.connection.execute(
        "BEGIN :ret := savepref(:username,:nitrogen_to_protein_min,:nitrogen_to_protein_max," +
        ":carbohydrate_factor_min,:carbohydrate_factor_max,:fat_factor_min,:fat_factor_max," +
        ":nitrogen_to_protein_min,:nitrogen_to_protein_max,); END;",
        { ret: { dir: oracledb.BIND_OUT, type: oracledb.number, maxSize: 10 } ,
            username: { val: type, dir: oracledb.BIND_IN, type: oracledb.STRING , maxSize: 100 } ,
            nitrogen_to_protein_min: { val: nitrogen_to_protein_min, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 } ,
            nitrogen_to_protein_max: { val: nitrogen_to_protein_max, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 } ,
            carbohydrate_factor_min: { val: carbohydrate_factor_min, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 } ,
            carbohydrate_factor_max: { val: carbohydrate_factor_max, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 } ,
            fat_factor_min: { val: fat_factor_min, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 } ,
            fat_factor_max: { val: fat_factor_max, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 } ,
            protein_factor_min: { val: protein_factor_min, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 } ,
            protein_factor_max: { val: protein_factor_max, dir: oracledb.BIND_IN, type: oracledb.number, maxSize: 10 }
        },
        function (err, result)
        {

            if (err) {
                console.log(err.message);
                if(fail){
                    fail();
                }
            }
            else{
                console.log(result.outBinds);
                success(result.outBinds.ret);
            }

        });

}

router.post('/', function(req, res,next){
    console.log(req.body);
    var nitrogen_min;
    var nitrogen_max;
    //nitrogen_to_protein_min
    if (req.body.nitrogen_min === undefined || req.body.nitrogen_min<0  ){
         nitrogen_min = 0;
    } else {
        if (req.body.nitrogen_min>=0 ){
            nitrogen_min = req.body.nitrogen_min;
        }
    }

    if (req.body.nitrogen_max === undefined || req.body.nitrogen_max<0  ){
         nitrogen_max = 5000;
    } else {
        {
            nitrogen_max = req.body.nitrogen_max;
        }
    }
    if (nitrogen_max<nitrogen_min){
        nitrogen_min=0;
        nitrogen_max=0;
    }
    console.log(nitrogen_min);
    console.log(nitrogen_max);


    var carbohydrate_min;
    var carbohydrate_max;
    //carbohydrate_factor_min
    if (req.body.carbohydrate_min === undefined || req.body.carbohydrate_min<0  ){
        carbohydrate_min = 0;
    } else {
        if (req.body.carbohydrate_min>=0 ){
            carbohydrate_min = req.body.carbohydrate_min;
        }
    }
    if (req.body.carbohydrate_max === undefined || req.body.carbohydrate_max<0  ){
        var carbohydrate_max = 5000;
    } else {
        {
            var carbohydrate_max = req.body.carbohydrate_max;
        }
    }
    if (carbohydrate_max<carbohydrate_min){
        carbohydrate_min=0;
        carbohydrate_max=0;
    }
    console.log(carbohydrate_min);
    console.log(carbohydrate_max);

    var fat_min;
    var fat_max;
    //fat_min
    if (req.body.fat_min === undefined || req.body.fat_min<0  ){
        fat_min = 0;
    } else {
        if (req.body.fat_min>=0 ){
            fat_min = req.body.fat_min;
        }
    }

    if (req.body.fat_max === undefined || req.body.fat_max<0  ){
        fat_max = 5000;
    } else {
        {
            fat_max = req.body.fat_max;
        }
    }
    if (fat_max<fat_min){
        fat_min=0;
        fat_max=0;
    }
    console.log(fat_min);
    console.log(fat_max);

    var protein_min;
    var protein_max;
    //protein_min
    if (req.body.protein_min === undefined || req.body.protein_min<0  ){
        protein_min = 0;
    } else {
        if (req.body.protein_min>=0 ){
            protein_min = req.body.protein_min;
        }
    }

    if (req.body.protein_max === undefined || req.body.protein_max<0  ){
        protein_max = 5000;
    } else {
        {
            protein_max = req.body.protein_max;
        }
    }
    if (protein_max<protein_min){
        protein_min=0;
        protein_max=0;
    }
    console.log(protein_min);
    console.log(protein_max);
    
    
    global.connection.execute('select * from preferencesfood where username=:u'
        ,[username], function (err,result){
            if(err){console.log(err.message);
                res.send('Error');
                return;}
            if(result.rows.length<=0)
            {
                console.log("insert");
                global.connection.execute(

                    "INSERT INTO preferencesfood "+
                    " VALUES "+
                    "(:0, :1, :2, :3, :4, :5, :6, :7,:8)",
                    [username, nitrogen_min, nitrogen_max, carbohydrate_min, carbohydrate_max,
                        fat_min, fat_max,protein_min, protein_max],
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

                console.log("update");
                global.connection.execute(
                    "UPDATE preferencesfood SET "+
                    " nitrogen_to_protein_min=:0,nitrogen_to_protein_max=:1, carbohydrate_factor_min=:2,carbohydrate_factor_max=:3," +
                    "fat_factor_min=:4," +"fat_factor_max=:5,protein_factor_min=:6,protein_factor_max=:7 where username=:8",
                    [nitrogen_min, nitrogen_max, carbohydrate_min, carbohydrate_max,
                        fat_min, fat_max,protein_min, protein_max, username]
                    ,
                    { autoCommit: true },
                    function(err, result) {

                        if (err) {
                            console.log("error on update foodpref : "+err.message);
                            res.render('foodpreferences', {response_text2:"Error:"+err.message});
                            // callback(err.message)
                            return;
                        }
                        res.render('foodpreferences', {response_text2:"Data updated!"});
                        console.log('Data updated!');

                    });
            }
        });
});



module.exports = router;