var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

router.get('/getAddElectronicsPreferencesBox',function(req,res){
   
   var username=req.session.username;
   if(!username)
   {
       res.send("You must be logged!")
       return;
   }
   
   global.connection.execute('select distinct brand from electronics',function(err,result){
      
       if(err){
           res.send("Eror ocurred on brand prefereces\n"+err.message);
           return;
       }
       var brands=[];
       for(var row in result.rows)
       {
           brands[row]=result.rows[row][0];
       }
       brands[brands.length]="None";
       global.connection.execute("select distinct operating_system from electronics",function(err2,result2){
           
           if(err2)
           {
               res.send("Eror ocurred on select operating system\n"+err2.message);
               return;
           }
           var oss=[];
           for(var row in result2.rows)
           {
               oss[row]=result2.rows[row][0];
           }
           oss[oss.length]="None";
           
          global.connection.execute("select distinct color from electronics",function(err3,result3){
             
             if(err3)
             {
                 res.send("Eror ocurred on select colors\n"+err3.message);
                 return;
             }
             var colors=[];
             for(var row in result3.rows)
             {
                 colors[row]=result3.rows[row][0];
             }
             colors[colors.length]="None";
             
             global.connection.execute("select distinct model_name from electronics",function(err4,result4){
                
                if(err4)
                {
                    res.send("Eror ocurred on select models\n"+err4.message);
                    return;
                }
                
                var models=[];
                for(var row in result4.rows)
                {
                    models[row]=result4.rows[row][0];
                }
                models[models.length]="None";
                
                res.render('components/prefencesBoxElectronics',{brands:brands,models:models,colors:colors,oss:oss});

             });
             
             
              
          });
           
       });
       
       
       
   });
   
   
   
    
});

router.post('/addPrefencesElectronics',function(req,res){
   
   var username=req.session.username;
   if(!username)
   {
       res.send('Must be logged!');
       return;
   }
   var brand=req.body.brand;
   var model=req.body.model;
   var color=req.body.color;
   var os=req.body.os;
   var min_price=req.body.min_price;
   var max_price=req.body.max_price;
   
   global.connection.execute('begin ins_electronic_preference(:u,:b,:m,:c,:os,:minp,:maxp); commit; end;',
     [username,brand,model,color,os,min_price,max_price],function(err,result){
       
       if(err)
       {
           console.log(err.message);
         res.redirect('/userprofile');
         return;
       }
       res.redirect('/userprofile');
         
     }
   );
    
});

router.get('/userpreferences',function(req,res){
   
   var username=req.session.username;
   if(!username)
   {
       res.send("You must be logged!");
       return;
   }
   var user_upper=username.toUpperCase();
   global.connection.execute('select id,brand,model_name,color,operating_system,min_price,max_price from electronics_preferences where upper(username)=:u',
   [user_upper],function(err,result){
      
      if(err)
      {
          res.send("An eror ocured when I tried to recive your preferences list!");
          console.log(err.message);
          return;
      }
      var cols={0:'ID',1:'Brand',2:'Model',3:'Color',4:'OS',5:'Min Price',6:'Max Price'};
      var prefereces=result.rows;
      var links=[];
      for(var row in result.rows)
      {
          links[row]='/electronics/deletePreference?id='+result.rows[row][0];
      }
      res.render('components/preferenceList',{columns:cols,preferences:prefereces,links:links});
      
      
      
       
   });
   
    
});


router.get('/deletePreference',function(req,res){
    
    if(!req.session.username)
    {
        res.send("You must be logged!");
        return;
    }
    var id=req.query.id;
    global.connection.execute('begin del_electronic_preference(:id);end;',
     [id],function(err,result){
         
         if(err)
         { 
             res.send("Eror Occured!");
             console.log(err.message);
             return;
         }
         res.redirect('/userprofile');
         
     });
     
});




module.exports = router;
