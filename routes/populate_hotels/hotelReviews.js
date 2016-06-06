var schedule = require('node-schedule');
module.exports = {
    insert_reviews: function (index, reviews, v_id_hotel, conn) {
        var requestify = require('requestify');
        var express = require('express');
        var router = express.Router();
        var oracledb = require('oracledb');
        if (index == reviews.length) {
            return;
        } else {
            var i = index;
            var id_hotel = v_id_hotel;

            var username = reviews[i].userNickname;
            var v_id_review = reviews[i].reviewId;
            var type_review = 0;
            if (parseInt(reviews[i].ratingOverall, 10) > 3) {
                type_review = 1;
            }
            var time_review = reviews[i].reviewSubmissionTime;
            var source_review = "Expedia";
            var review = reviews[i].reviewText;

            var bindVars =
            {
                id_hotel: id_hotel,
                username: username,
                v_id_review: v_id_review,
                type_review: type_review,

                time_review: time_review,
                source_review: source_review,
                review: review,
                response: {dir: oracledb.BIND_INOUT}
            };


            conn.execute(
                "BEGIN insert_reviews(:v_id_review,:username,:id_hotel,:type_review,:time_review,:source_review,:review," +
                ":response); END;",
                bindVars,
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        console.log("Error at insert");
                        return;
                    }
                    if (result.outBinds.response.trim() == 'inserted') {
                        var responsetext = 'Review inserted';
                        console.log(result.outBinds.response.trim());

                    }
                    else {
                        var responsetext = 'Review canot be inserted!';
                        console.log(result.outBinds.response.trim());
                    }

                    module.exports.insert_reviews(index + 1, reviews, id_hotel, conn);


                });


        }
    },

    get_reviews: function (index, hotel_list, conn) {
        var requestify = require('requestify');
        if (index == hotel_list.length) {
            return;
        } else {
            // setTimeout(function(){
            requestify.get('http://terminal2.expedia.com/x/reviews/hotels?hotelId=' +
                    hotel_list[index] + '&apikey=UGw55vYAHlGISktWebfNqdZdSEuqmaPG')
                .then(function (response) {
                        console.log("index: " + index);
                        // Get the response body (JSON parsed or jQuery object for XMLs)
                        console.log("id_hotel=" + hotel_list[index] + "\n" + response.getBody());
                        var reviews = response.getBody().reviewDetails.reviewCollection.review;
                        /*
                         (v_id_review varchar2,username varchar2 ,id_hotel varchar2,type_review number,
                         time_review varchar2, source_review varchar2,review varchar2 ,response out varchar2)
                         * */

                        var id_hotel = hotel_list[index];
                        module.exports.insert_reviews(0, reviews, id_hotel, conn);

                        module.exports.get_reviews(index + 1, hotel_list, conn);
                    }
                );
            // }, 1000);
        }


    },

    populateReviews : function(){

        console.log('scheduler');
        var cron = require('node-cron');

        cron.schedule('* * 3 * * *', function(){
            global.connection.execute('select id_hotel from hotels'
                , function (err, result) {
                    console.log('in cron query');
                    if (err) {
                        console.log(err.message);
                        res.send('Erorr ocured!');
                        return;
                    }

                    if (result.rows.length>0){
                        var hotelIds =[];
                        var i = 0;
                        for (var row in result.rows) {
                            hotelIds.push(result.rows[row][0]);
                        }
                        console.log('Hotel IDs: '+hotelIds);

                        module.exports.get_reviews(0,hotelIds,global.connection);


                    }

                }
            )
        });
    }
};