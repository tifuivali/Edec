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
   if(!pass=='edecYAH')
   {
       res.send("Must be admin~!");
       return;
   }
   
   
   var job = new CronJob('0 * * * * *',function () {
      
      
    console.log('Am pornit...');
    global.connection.execute('select username,email from useri',function(err,result){
       
        for(var row in result.rows)
        {
            var username=result.rows[row][0];
            var email=result.rows[row][1];
            console.log('user: '+username+" email: "+email);
            global.connection.execute('select * from notication where username=:u and state=1 order by date desc',
            [username],function(err1,result1){
               
               if(err)
               {
                   console.log("Errrrr: "+err.message);
                   return;
               }
               
               if(!result1)
               {
                   console.log("No Notification!");
                   return;
               }
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
                console.log('Message sent ' + info.response);
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
