var express = require('express');
var router = express.Router();
var oracledb=require('oracledb');
var nodemailer = require('nodemailer');
var CronJob = require('cron').CronJob;



router.get('/test',function(req,res){
   
     var transporter = nodemailer.createTransport('smtps://edec3000%40gmail.com:edec2016@smtp.gmail.com');
               var mailOptions = {
               from: '"EDEC 👥" <edec3000@gmail.com>', // sender address
               to: 'tifuivali@gmail.com', // list of receivers
               subject: '✔New Notification', // Subject line
               text: '🐴 salut'// plaintext body
               };
               
     transporter.sendMail(mailOptions, function(error, info){
    if(error){
        res.send("Eroare"+error);
        return;
    }
    res.send('Message sent ' + info.response);
});     

                
});

router.get('/start',function(req,res){
   
   var pass=req.query.pass;
   if(pass!='edecYAH')
   {
       res.send("Must be admin~!");
       return;
   }
   
   
   var job = new CronJob('0 * * * * *',function () {
      
      
    console.log('Am pornit...');
    global.connection.execute('select username,email from useri',function(err,result){
       
       if(err)
       {
           return;
       }
        var k=0;
        for(var row in result.rows)
        {
            var username=result.rows[row][0];
            var email=result.rows[row][1];
            console.log('user: '+username+" email: "+email);
            global.connection.execute('select * from noticari where username=:u and state=1 order by data desc',
            [username],function(err1,result1){
               
               
               
               if(err1)
               {
                   console.log("Errrrr: "+err.message);
                   return;
               }
               
               if(result1)
               {
                   if(!result1.rows)
                   {
                       return;
                   }
                   else         
                   if(result1.rows)
                   {
                       console.log('LEN: '+result1.rows.length);
                       if(result1.rows.length<1)
                       {
                           return;
                       }
                   }
               }
               if(!result1)
               {
                   console.log("No Notification!");
                   return;
               }
              
               
               var username=result1.rows[0][0];
               var email=result1.rows[0][5];
             
               
               console.log('to_send '+username +' '+email);
               //mail
               var message='';
               for(var row in result1.rows)
               {
                   message+='<h1>'+result1.rows[row][1]+'</h1>';
                   message+='<p>'+result1.rows[row][2]+'</p>';
                   message+='<br><br><br>';
               }
               
               var transporter = nodemailer.createTransport('smtps://edec3000%40gmail.com:edec2016@smtp.gmail.com');
               var mailOptions = {
               from: '"EDEC 👥" <edec3000@gmail.com>', // sender address
               to: email, // list of receivers
               subject: '✔New Notification from Edec!', // Subject line
               html:message  // plaintext body
               };

               transporter.sendMail(mailOptions, function(error, info){
               if(error){
                 console.log("Eroare "+error);
                 return;
                }
                console.log('Message sent to '+email+' '+ info.response);
                global.connection.execute('begin update noticari set state=0 where username=:u; commit; end;',
                [username],function(err,ress)
                {
                    if(err)
                    {
                        console.log('Nu am putut modifica state');
                    }
                    console.log('Am modificat state for '+username);
                });
                
               });
               
                    
               
                
            });
            
            
        }
        
    });
    
  },
  true, /* Start the job right now */
  'Europe/Bucharest'
);
  
  res.send("Job started!");  
});





module.exports = router;
