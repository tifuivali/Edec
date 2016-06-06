var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    usernameToSend=req.session.username;
    res.render('notifications', { title: 'mail',logged:1,username:usernameToSend });
});
router.get('/openEmail', function(req, res) {
    var username=req.session.username;
    var email = req.query.email;
    var data = req.query.date;

    global.connection.execute('select  titlu,mesaj,to_char(data), email, state  from noticari where email=:email' +
        ' and to_char(data)=:data',
        [email,data],function(err,result){

            if(err){
                res.send("Erorr ocurred!");
                console.log("Err get matched \n"+err.message);
                return;
            }



            console.log(result.rows.length);
            var messages=[];
            var message=[];
            for(var row in result.rows)
            {
                message.sender=result.rows[row][3];
                message.title = result.rows[row][0];
                message.data = result.rows[row][2];
                message.content = result.rows[row][1];
                message.state = result.rows[row][4];
                messages[row]=message;
                break;
            }

            global.connection.execute('update noticari set state=0 where to_char(data)=:data and ' +
                'username=:username and titlu=:titlu',
                [data,username, message.title],
                {autoCommit:true}

                ,function(err,result) {

                    if (err) {
                        // res.send("Erorr ocurred!");
                        console.log("Err get matched \n" + err.message);
                        return;
                    }
                });

            res.render('components/viewNotification',{message:message});


        });


    // res.render('viewNotification', { title: 'mail',logged:1,username:usernameToSend });
});

router.get('/getMail',function(req,res){
    var username=req.session.username;
    if(!username)
    {
        res.send('You must be logged!');
        return;
    }
    console.log("!!!!!!!!!!!!!!!!!!!!notifications");
    global.connection.execute('select titlu,mesaj,to_char(data), state,email from noticari where username=:username',
        [username],function(err,result){

            if(err){
                res.send("Erorr ocurred!");
                console.log("Err get matched \n"+err.message);
                return;
            }

            var messages=[];
            for(var row in result.rows)
            {
                var message=[];
                message.sender=result.rows[row][4];
                message.title = result.rows[row][0];
                message.data = result.rows[row][2];
                message.state = result.rows[row][3];
                messages[row]=message;
            }

            res.render('components/notifTable',{messages:messages});


        });

});

module.exports = router;

