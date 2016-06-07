
var oracledb=require('oracledb');
var express = require('express');
module.exports = {

    insertLocationPref : function (country,city,req,res) {
        var username = req.session.username;
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
                var foundMatch =1;
                if(result.outBinds.response.trim()=='inserted'){
                    var responsetext='Values inserted'
                    console.log("Hotel pref location!!!!: "+result.outBinds.response.trim());


                }else if(result.outBinds.response.trim()=='no location'){
                    console.log("Location not in DB! "+city);
                    foundMatch = 0;
                }
                else{
                    var responsetext='Values canot be inserted!';
                    console.log("Hotel pref location!!!!: "+result.outBinds.response.trim());
                }

                res.render('hotelpreferences', { title: 'hotel prefferences',logged:1,username:username,
                    response_text:responsetext, foundMatch: foundMatch });


            });
    }

};  