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

                product.picture=result.rows[row][5];
                //product.nr_users="Expedia rating: "+result.rows[row][8];
                //if (product.nr_users.length>2 ) product.nr_users=product.nr_users.substring(0,20);
                product.nr_users1="Up votes: "+result.rows[row][7];
                product.nr_users2="Down votes: "+result.rows[row][8];
                product.location=result.rows[row][3]+" "+result.rows[row][2];
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

                product.picture=result.rows[row][4];
                product.nr_users="matched to "+result.rows[row][5]+" profiles";
                product.location=result.rows[row][6]+" "+result.rows[row][7];
                products[row]=product;
            }

            res.render('components/productTop',{products:products});


        });

}



};
