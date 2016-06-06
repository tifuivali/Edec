module.exports = {
        getUserReviewsElectronics:function (req,res,username,page){
        console.log("In get User Reviews Electornics!!!!!!");
        global.connection.execute('SELECT * from('+
            'SELECT f.*, ROWNUM r FROM ('+
            ' select * from electronics_reviews e_r join electronics e on ' +
            '  e.product_id=e_r.product_id  WHERE username=:u'
            +') f Where ROWNUM <=(:p1*10)) WHERE r>((:p2-1)*10)'
            ,[username,page,page], function (err,result){
                if(err){console.log(err.message);
                    res.send('Error');
                    return;}
                if(result.rows.length<=0)
                    res.send('No results.');
                else
                {var reviews = [];
                    for (var row in result.rows) {
                        var review = [];
    
                        review.title = result.rows[row][11] + result.rows[row][10];
                        review.body = result.rows[row][3];
                        review.upVotes = result.rows[row][6];
                        review.downVotes = result.rows[row][7];
                        review.location = result.rows[row][8].replace("_"," ");
                        review.author = result.rows[row][1];
                        var nr_random = Math.floor((Math.random() * 3) + 0);
                        review.picture = "/images/electronics" + nr_random + ".png";
                        if (review.author === null) {
                            review.author = "Anonymous";
                        }
                        //review.rev_date = result.rows[row][date_index].substr(0, 10);
                        review.link = result.rows[row][15];
                        review.source_name = result.rows[row][5];
                        if (review.source_name.localeCompare("Expedia") != 0) {
                            review.source_name = "EDEC";
                        }
                        reviews[row] = review;
                    }
                    res.render('components/review', {reviews: reviews});
    
                }
            });
    
    
    },
    getUserReviewsFood:function (req,res,username,page){
        console.log("In get User Reviews Electornics!!!!!!");
        global.connection.execute('SELECT * from('+
            'SELECT f.*, ROWNUM r FROM ('+
            ' select to_char(time_review),username,review, up_votes,' +
            'down_votes,food_name,f.SHORT_DESCRIPTION from reviewsfood r_f join food f on ' +
            '  r_f.food_id=f.food_id  WHERE username=:u'
            +') f Where ROWNUM <=(:p1*10)) WHERE r>((:p2-1)*10)'
            ,[username,page,page], function (err,result){
                if(err){console.log(err.message);
                    res.send('Error');
                    return;}
                if(result.rows.length<=0)
                    res.send('No results.');
                else
                {

                    var reviews = [];
                    for (var row in result.rows) {
                        var review = [];

                        review.title = result.rows[row][5];
                        review.body = result.rows[row][2];
                        review.upVotes = result.rows[row][3];
                        review.downVotes = result.rows[row][4];
                        //review.location = "EDEC";
                        review.author = result.rows[row][1];
                        var nr_random = Math.floor((Math.random() * 3) + 0);
                        review.picture = "/images/food" + nr_random + ".jpg";
                        if (review.author === null) {
                            review.author = "Anonymous";
                        }
                        review.rev_date = result.rows[row][0];
                        //review.link = result.rows[row][15];
                        review.source_name = "EDEC";

                        reviews[row] = review;
                    }
                    res.render('components/review', {reviews: reviews});

                }
            });


    },
    getUserReviewsHotels:function (req,res,username,page){
        console.log("In get User Reviews Electornics!!!!!!");
        global.connection.execute('SELECT * from('+
            'SELECT f.*, ROWNUM r FROM ('+
            ' select * from hotels_reviews h_r join hotels h on h_r.id_hotel=h.id_hotel WHERE username=:u'
            +') f Where ROWNUM <=(:p1*10)) WHERE r>((:p2-1)*10)'
            ,[username,page,page], function (err,result){
                if(err){console.log(err.message);
                    res.send('Error');
                    return;}
                if(result.rows.length<=0)
                    res.send('No results.');
                else
                {
                    var body_index = 6;
                    var user_index = 1;
                    var upVotes_index = 7;
                    var downVotes_index = 8;
                    var date_index = 4;
                    var name_index = 10;
                    var index_city = 12;
                    var index_country = 11;
                    var link_index = 15;

                    var reviews = [];
                    for (var row in result.rows) {
                        var review = [];


                        review.body = result.rows[row][body_index];
                        review.upVotes = result.rows[row][upVotes_index];
                        review.downVotes = result.rows[row][downVotes_index];
                        review.location = result.rows[row][index_city] + " " + result.rows[row][index_country];
                        review.author = result.rows[row][user_index];
                        if (review.author === null) {
                            review.author = "Anonymous";
                        }
                        review.picture = result.rows[row][16];
                        review.rev_date = result.rows[row][date_index].substr(0, 10);
                        review.link = result.rows[row][link_index];
                        review.source_name = result.rows[row][5];
                        if (review.source_name.localeCompare("Expedia") != 0) {
                            review.source_name = "EDEC";
                        }

                        reviews[row] = review;
                    }
                    // console.log(reviews);
                    res.render('components/review', {reviews: reviews});

                }
            });


    }

}
