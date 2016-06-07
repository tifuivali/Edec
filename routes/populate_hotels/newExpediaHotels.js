var insertHotelLocPref = require('../controller/insertHotelLocPref')
module.exports = {
    verify_property:function (property_value, column, id_list){
        var express = require('express');
        var router = express.Router();
        var oracledb = require('oracledb');
        var requestify = require('requestify');
        var upd_value=1;
        requestify.get('http://terminal2.expedia.com/x/nlp/results?q='+property_value+'&apikey=UGw55vYAHlGISktWebfNqdZdSEuqmaPG')
            .then(function(response) {

                console.log('received property properties');
                response.getBody();
                for (var i=0;i<response.getBody().result.hotels.length;i++){
                    if (id_list.indexOf(response.getBody().result.hotels[i].id)>-1){
                        global.connection.execute(
                            "UPDATE hotels SET "+
                            column+"=:0 where id_hotel=:1",
                            [upd_value,response.getBody().result.hotels[i].id]
                            ,
                            { autoCommit: true },
                            function (err, result) {
                                if (err) {
                                    console.error(err.message);
                                    console.log("Error at update")
                                    return;
                                }
                            });
                    }
                }
            });
    },

get_hotels:function (city, country,req,res){
    var express = require('express');
    var router = express.Router();
    var oracledb = require('oracledb');
    var requestify = require('requestify');
    var location_city=city;
    var location_country=country;
    var hotelReviews = require('./hotelReviews');
    var location=location_city.split(' ').join('%20')+'%20'+location_country.split(' ').join('%20');
    var firstInsert= true;

    requestify.get('http://terminal2.expedia.com/x/geo/features?ln.op=cn&ln.value='+location+
            '&type=multi_city_vicinity&verbose=2&limit=1&apikey=UGw55vYAHlGISktWebfNqdZdSEuqmaPG')
        .then(function(response_geo) {
                var body=response_geo.getBody();
                var id_location=body[0].id;
                console.log("id location: "+id_location);
                var id_list=[];
            

                requestify.get('http://terminal2.expedia.com/x/geo/features/'+id_location+
                        '/features?type=hotel&top=100&verbose=3&lcid=1033&apikey=UGw55vYAHlGISktWebfNqdZdSEuqmaPG')
                    .then(function(response_geo1) {
                            var h_list=response_geo1.getBody();
                        console.log('received hotels');

                            var ids = '';
                            for (var j=0;j<h_list.length;j++){
                                ids += h_list[j].source.srcId+',';
                                id_list.push(h_list[j].source.srcId);

                            }
                            requestify.get('http://terminal2.expedia.com/x/hotels?hotelids='+ids.substr(0,ids.length-1)+
                                    '&dates=2016-06-19,2016-06-22&apikey=UGw55vYAHlGISktWebfNqdZdSEuqmaPG')
                                .then(function(response) {
                                    console.log('received hotel info');
                                    response.getBody();
                                    for (var i=0;i<response.getBody().HotelInfoList.HotelInfo.length;i++){


                                        console.log('getting info');
                                        var hotels=response.getBody();
                                        var v_id_hotel=hotels.HotelInfoList.HotelInfo[i].HotelID ;


                                        var name_hotel=hotels.HotelInfoList.HotelInfo[i].Name;

                                        var country=location_country;

                                        var city=location_city;

                                        var stars=parseInt(hotels.HotelInfoList.HotelInfo[i].StarRating,10);

                                        var currency="";
                                        var price=0;
                                        if (hotels.HotelInfoList.HotelInfo[i].Price !== undefined) {
                                            currency=hotels.HotelInfoList.HotelInfo[i].Price.TotalRate.Currency;

                                            price=parseFloat(hotels.HotelInfoList.HotelInfo[i].Price.TotalRate.Value);


                                        }


                                        var details_url=hotels.HotelInfoList.HotelInfo[i].DetailsUrl;

                                        var thumb_nail_url=hotels.HotelInfoList.HotelInfo[i].ThumbnailUrl;

                                        var guest_rating=parseFloat(hotels.HotelInfoList.HotelInfo[i].GuestRating);

                                        var description=hotels.HotelInfoList.HotelInfo[i].Description;

                                        console.log('getting amenities');
                                        var has_non_smoking=0;
                                        if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList!==undefined){
                                            if(hotels.HotelInfoList.HotelInfo[i]
                                                    .RoomTypeList.RoomType.SmokingAvailable.HasNonSmoking.localeCompare("true")==0)
                                            {
                                                has_non_smoking=1;
                                            }
                                        }




                                        var has_smoking=0;
                                        if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList!==undefined){
                                            if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList.RoomType.
                                                SmokingAvailable.HasSmoking.localeCompare("true")==0)
                                            {
                                                has_smoking=1;
                                            }
                                        }




                                        var free_internet=0;
                                        if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList!==undefined){
                                            if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList.RoomType.
                                                FreeInternet.localeCompare("true")==0)
                                            {
                                                free_internet=1;
                                            }
                                        }




                                        var free_cancelation=0;
                                        if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList!==undefined){
                                            if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList.RoomType.
                                                FreeCancellation.localeCompare("true")==0)
                                            {
                                                free_cancelation=1;
                                            }
                                        }



                                        var free_parking=0;
                                        if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList!==undefined){
                                            if(hotels.HotelInfoList.HotelInfo[i].RoomTypeList.RoomType.
                                                FreeParking.localeCompare("true")==0){
                                                free_parking=1;
                                            }
                                        }



                                        var swimming_pool=0;
                                        if(hotels.HotelInfoList.HotelInfo[i].AmenityList!==undefined){
                                            if(hotels.HotelInfoList.HotelInfo[i].AmenityList.Amenity.indexOf("Swimming pool")>-1)
                                            {
                                                swimming_pool=1;
                                            }
                                        }




                                        console.log('before bind');
                                        var bindVars =
                                        {
                                            v_id_hotel:v_id_hotel ,
                                            name_hotel:name_hotel,
                                            country:country,
                                            city:city,
                                            stars:stars,
                                            currency:currency,
                                            details_url:details_url,
                                            thumb_nail_url:thumb_nail_url,
                                            guest_rating:guest_rating,
                                            price:price,
                                            description:description,
                                            has_non_smoking:has_non_smoking,
                                            has_smoking:has_smoking,
                                            free_internet:free_internet,
                                            free_cancelation:free_cancelation,
                                            free_parking:free_parking,
                                            swimming_pool:swimming_pool,
                                            id_location:id_location,
                                            response: { dir: oracledb.BIND_INOUT }
                                        };

                                        console.log('inserting hotels');
                                        global.connection.execute(
                                            "BEGIN insert_hotels(:v_id_hotel,:name_hotel,:country,:city,:stars,:currency,:details_url," +
                                            ":thumb_nail_url,:guest_rating,:price,:description,:has_non_smoking,:has_smoking," +
                                            ":free_internet," +":free_cancelation,:free_parking,:swimming_pool,:id_location,:response); END;",
                                            bindVars,
                                            function (err, result)
                                            {
                                                if (err) { console.error(err.message);
                                                    console.log("Error at insert")
                                                    return;
                                                }
                                                if(result.outBinds.response.trim()=='inserted'){
                                                    responsetext='Values inserted'
                                                    console.log(result.outBinds.response.trim());

                                                }
                                                else{
                                                    responsetext='Values canot be inserted!';
                                                    console.log(result.outBinds.response.trim());
                                                }

                                                if(firstInsert){
                                                    insertHotelLocPref.insertLocationPref(country,city,req,res);
                                                    firstInsert = false;
                                                }



                                            });
                                        /*  */
                                    }
                                    var property="accessibility%20"+location;
                                    var column="disabled_people";

                                    hotelReviews.get_reviews(0,id_list, global.connection);
                                    
                                    console.log('verifying properties');

                                    verify_property(property, column,id_list);


                                    verify_property('pet%20friendly%20'+location, 'PET_FRIENDLY',id_list);


                                    verify_property('conference%20'+location, 'CONFERENCE_ROOM',id_list);

                                    verify_property('restaurant%20'+location, 'HAS_RESTAURANT',id_list);

                                    verify_property('playground%20'+location, 'PLAYGROUND',id_list);








                                });

                        }
                    );

            }
        );
}
}
