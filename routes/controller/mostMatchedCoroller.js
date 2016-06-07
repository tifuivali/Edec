module.exports = {

    getMostMatchedToYouHotels:function(req,res,user){
    console.log("most matched to you hotels...");
    global.connection.execute('select * from (select id_hotel,name_hotel, country, city,details_url,' +
        ' thumb_nail_url, description, up_votes, down_votes'+
        ' from  hotels where hotels_info.is_matched_hotel(:username, id_hotel)=1) where rownum<4',
        [user],
        function(err,result){

            if(err){
                console.log(err.message);
                res.send('Erorr ocured!');
                return;
            }

            if(result.rows.length<=0)
            {
                res.send('No results for this category!');
                return;
            }



            var products=[];
            for(var row in result.rows)
            {
                var product=[];
                product.title=result.rows[row][1];
                product.description=result.rows[row][6].substring(0,70)+'...';
                product.seller=result.rows[row][4];
                product.id=result.rows[row][0];
                product.picture=result.rows[row][5];
                //product.nr_users="Expedia rating: "+result.rows[row][8];
                //if (product.nr_users.length>2 ) product.nr_users=product.nr_users.substring(0,20);
                product.nr_users1="Up votes: "+result.rows[row][7];
                product.nr_users2="Down votes: "+result.rows[row][8];
                product.location=result.rows[row][3]+" "+result.rows[row][2];
                product.category='hotels';
                products[row]=product;
            }

            res.render('components/productTop',{products:products});



        });
},
    getMostMatchedtoHotels:function (req,res,maxrows) {

    global.connection.execute(
        'select * from (SELECT id_hotel,name_hotel,description, details_url,thumb_nail_url,tops_hotels.nr_matched_users(id_hotel),city,country FROM hotels'+
        ' where tops_hotels.nr_matched_users(id_hotel)>0  order by tops_hotels.nr_matched_users(id_hotel) desc) where rownum<4 ',
        function(err,result){

            if(err){
                console.log("Error! "+err.message);
                res.send('Erorr ocured!');
                return;
            }

            if(result.rows.length<=0)
            {
                res.send('No results for this category!');
                return;
            }

            //var result_products=result.slice(0,maxrows);
            var products=[];
            for(var row in result.rows)
            {
                var product=[];
                product.title=result.rows[row][1];
                product.description=result.rows[row][2].substring(0,70)+'...';
                product.seller=result.rows[row][3];
                product.id=result.rows[row][0];
                product.picture=result.rows[row][4];
                product.nr_users="matched to "+result.rows[row][5]+" profiles";
                product.category='hotels';
                product.location=result.rows[row][6]+" "+result.rows[row][7];
                products[row]=product;
            }

            res.render('components/productTop',{products:products});


        });

},
getMostMatchedToYouElectronics:function(req,res,user){
    console.log('User: '+user+ '...'+user.length);
    global.connection.execute('select * from '+user+'_MOSTMATCH_ELECTRINICS where rownum<=5'
    ,function(err,result){
      
      if(err){
          res.send("Cannot make statistics with your preferences.");
          console.log("Err get matched \n"+err.message);
          return;
      }
      
      var prds=[];
      for(var row in result.rows)
      {
          var product=[];
          product.title=result.rows[row][0];
         
          //product.description=result.rows[row][3];
          if(result.rows[row][3])
          product.description=result.rows[row][3].substring(0,100);
          product.seller=result.rows[row][1];
          product.picture=result.rows[row][2];
          product.id=result.rows[row][5];
          console.log(product.picture);
          product.category='electronics';
          prds[row]=product;
      }
      
       res.render('components/productTop',{products:prds});
      
        
   });
    
},

getMostMatchedToYouFood:function(req,res,user){
        console.log("most matched to you food...");
        global.connection.execute('select * from (select * ' +
            ' from food where aliments_info.is_matched_aliment(:username, food_id)=1) where rownum<20',
            [user],
            function(err,result){

                if(err){
                    console.log(err.message);
                    res.send('Erorr ocured!');
                    return;
                }

                if(result.rows.length<=0)
                {
                    res.send('No results for this category!');
                    return;
                }



                var products=[];
                for(var row in result.rows)
                {
                    var product=[];
                    product.title=result.rows[row][1];
                    if (result.rows[row][2]!=null) {
                        product.description = result.rows[row][2];
                    }
                    product.seller=result.rows[row][4];

                    var nr_random = Math.floor((Math.random() * 3) + 0);
                    product.picture = "/images/food" + nr_random + ".jpg";
                    //product.nr_users="Expedia rating: "+result.rows[row][8];
                    //if (product.nr_users.length>2 ) product.nr_users=product.nr_users.substring(0,20);
                    product.location=result.rows[row][3];
                    products[row]=product;
                }

                res.render('components/productTop',{products:products});



            });
    },
    getMostMatchedtoFood:function(req,res,user){
        console.log("most matched to you food...");
        global.connection.execute('select * from (select food_name,SHORT_DESCRIPTION,FOOD_GROUP,' +
            'tops_aliments.nr_matched_users(food_id) ' +
            ' from food where tops_aliments.nr_matched_users(food_id)>0  order ' +
            'by tops_aliments.nr_matched_users(food_id)  desc) where rownum<20 ',
            function(err,result){

                if(err){
                    console.log(err.message);
                    res.send('Erorr ocured!');
                    return;
                }

                if(result.rows.length<=0)
                {
                    res.send('No results for this category!');
                    return;
                }



                var products=[];
                for(var row in result.rows)
                {
                    var product=[];
                    product.title=result.rows[row][0];
                    if (result.rows[row][1]){
                        product.description=result.rows[row][1];
                    }


                    var nr_random = Math.floor((Math.random() * 3) + 0);
                    product.picture = "/images/food" + nr_random + ".jpg";
                    //product.nr_users="Expedia rating: "+result.rows[row][8];
                    //if (product.nr_users.length>2 ) product.nr_users=product.nr_users.substring(0,20);
                    product.location=result.rows[row][2];
                    product.nr_users="matched to "+result.rows[row][3]+" profiles";
                    products[row]=product;
                }

                res.render('components/productTop',{products:products});



            });
    }


 

};
