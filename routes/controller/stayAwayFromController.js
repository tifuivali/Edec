module.exports = {

    getStayAwayFromHotels:function (req,res,user){
    console.log("you might like...");

    global.connection.execute('select * from (select name_hotel, country, city, details_url, thumb_nail_url, ' +
        ' description, up_votes, down_votes, hotels_info.hotel_reviews(id_hotel,1), hotels_info.hotel_reviews(id_hotel,0)'+
        ' from  hotels where hotels_info.is_matched_hotel(:username , id_hotel)=1 and'+
        ' (hotels_info.hotel_reviews(id_hotel,0)>hotels_info.hotel_reviews(id_hotel,1))  and up_votes<down_votes order by'+
        ' hotels_info.hotel_reviews(id_hotel,0)-hotels_info.hotel_reviews(id_hotel,1) desc) where rownum<20',
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

                product.title=result.rows[row][0];
                product.body=result.rows[row][5];
                product.upVotes=result.rows[row][6];
                product.downVotes=result.rows[row][7];
                product.location=result.rows[row][2]+" "+result.rows[row][1];
                product.nr_pos_reviews="positive reviews: "+result.rows[row][8];
                product.nr_neg_reviews="negative reviews: "+result.rows[row][9];

                product.picture=result.rows[row][4];
                product.link=result.rows[row][5];

                products[row]=product;
            }
            // console.log(reviews);
            res.render('components/productMatched',{products:products});



        });
},
    getStayAwayFromFood:function (req,res,user){
    console.log("you might like...");

    global.connection.execute('select * from (select food_name, SHORT_DESCRIPTION,FOOD_GROUP, '+
        'aliments_info.aliment_reviews(food_id,1), aliments_info.aliment_reviews(food_id,0) '+
        'from  food where aliments_info.is_matched_aliment(:username , food_id)=1 and '+
        '( aliments_info.aliment_reviews(food_id,0)> aliments_info.aliment_reviews(food_id,1))   order by '+
        ' aliments_info.aliment_reviews(food_id,0)-aliments_info.aliment_reviews(food_id,1) desc) where rownum<20',
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

                product.title=result.rows[row][0];
                product.body=result.rows[row][1];


                product.location=result.rows[row][2];
                product.nr_pos_reviews="positive reviews: "+result.rows[row][3];
                product.nr_neg_reviews="negative reviews: "+result.rows[row][4];

                var nr_random = Math.floor((Math.random() * 3) + 0);
                product.picture = "/images/food" + nr_random + ".jpg";


                products[row]=product;
            }
            // console.log(reviews);
            res.render('components/productMatched',{products:products});



        });
},

getStayAwayFromElectronics:function(req,res,user){
      
      
       global.connection.execute('select * from (select * from '+user+"_MOSTMATCH_ELECTRINICS where prg<=0.20) where rownum<=5",
         function(err,result){
            
            if(err)
            {
                console.log(err.message);
                res.send("Must have minimim a preference for this category! or cannot make a statistic!");
                return;
            }
            
            var products=[];
                for(var row in result.rows)
                {
                    var product=[];
    
                    product.title=result.rows[row][0];
                    product.body=result.rows[row][3];
                    product.picture=result.rows[row][2];
                    product.link=result.rows[row][1];
    
                    products[row]=product;
                }
                // console.log(reviews);
                res.render('components/productMatched',{products:products});
             
         });
  }





}
