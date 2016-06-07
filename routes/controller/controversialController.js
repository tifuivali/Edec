module.exports = {

    getControversalHotels:function (req,res){
    console.log("controversial hotels...");
    global.connection.execute('select* from (SELECT id_hotel,name_hotel,description, details_url,THUMB_NAIL_URL,'+
        ' hotels_info.hotel_reviews(id_hotel,1),hotels_info.hotel_reviews(id_hotel,0),city, country '+
        ' FROM hotels where  tops_hotels.nr_dif_positive_neg_rev(id_hotel) between 0 and 5 and hotels_info.hotel_reviews(id_hotel,1)<>0 and'+
        ' hotels_info.hotel_reviews(id_hotel,0)<>0 order by LEAST(hotels_info.hotel_reviews(id_hotel,0),hotels_info.hotel_reviews(id_hotel,1)) desc  ) where rownum<20',
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
                product.description=result.rows[row][2].substring(0,70)+'...';
                product.seller=result.rows[row][3];

                product.picture=result.rows[row][4];
                product.nr_users="Positive reviews: "+result.rows[row][5];
                product.nr_users1="Negative reviews: "+result.rows[row][6];
                product.location=result.rows[row][7]+" "+result.rows[row][8];
                products[row]=product;
            }

            res.render('components/productTop',{products:products});



        });

},
    getControversalFood:function (req,res){
        console.log("controversial hotels...");
        global.connection.execute('select* from (SELECT food_name,SHORT_DESCRIPTION,FOOD_GROUP, '+
            ' aliments_info.aliment_reviews(food_id,1),aliments_info.aliment_reviews(food_id,0) '+
            ' FROM food where  abs(aliments_info.aliment_reviews(food_id,0)-aliments_info.aliment_reviews(food_id,1))' +
            ' between 0 and 5 and aliments_info.aliment_reviews(food_id,1)<>0 and'+
            ' aliments_info.aliment_reviews(food_id,0)<>0 order by LEAST(aliments_info.aliment_reviews(food_id,0),aliments_info.aliment_reviews(food_id,1)) desc  ) where rownum<20',
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
                    if (result.rows[row][1]!=null){
                        product.description=result.rows[row][1];
                    }



                    var nr_random = Math.floor((Math.random() * 3) + 0);
                    product.picture = "/images/food" + nr_random + ".jpg";
                    product.nr_users="Positive reviews: "+result.rows[row][3];
                    product.nr_users1="Negative reviews: "+result.rows[row][4];

                    products[row]=product;
                }

                res.render('components/productTop',{products:products});



            });

    }
}
