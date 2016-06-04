module.exports = {

    getUndesirableHotels:function (req,res,maxrows){
    console.log("undesirable hotels...");
    global.connection.execute('select * from (select * from  hotels where guest_rating is not null order by  guest_rating asc) where rownum<4',
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
                product.description=result.rows[row][10].substring(0,70)+'...';
                product.seller=result.rows[row][6];

                product.picture=result.rows[row][7];
                product.nr_users="Expedia rating: "+result.rows[row][8];
                if (product.nr_users.length>2 ) product.nr_users=product.nr_users.substring(0,20);
                //product.nr_users1="Up votes: "+result.rows[row][22];
                // product.nr_users2="Down votes: "+result.rows[row][23];
                product.location=result.rows[row][3]+" "+result.rows[row][2];
                products[row]=product;
            }

            res.render('components/productTop',{products:products});



        });

}

}
