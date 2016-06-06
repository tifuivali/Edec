var host = "http://localhost:3000";
$(document).ready(function () {

    var username = $("#username").text();


    var getLocationList = function (username) {
        $.get(host + '/hotelpreferences/location?username=' + username,
            function (data, succes) {

                $("#hotels-location").html(data);
                if ($('#foundMatch').val() == true){
                    $('#submitLocation').after('<p>No matches found for inserted location. ' +
                        'Press the button below to try and retrieve it from our partners </p>');
                    $('#foundMatch').after('<input type="button" id="proceedButton" value="Proceed">');
                    $('#foundMatch').click(expediaSearch());
                }
                $('.delete_button').click(function(){
                    var idLocation = $(this).parent()[0].firstElementChild.value;
                    $.get(host + '/hotelpreferences/deleteLocation?id=' + idLocation+'&username='+username,
                        function (data, succes) {

                            getLocationList(username);

                        });
                });

            });
    };



    var getPrefList = function () {
        $.get(host + '/hotelpreferences/peferences',
            function (data, succes) {

                $("#hotels-saved").html(data);

                $('.delete_pref').click(function(){
                    var valoare = $(this).parent()[0].value;
                    $.get(host + '/hotelpreferences/deletePref?value=' + valoare,
                        function (data, succes) {

                            getPrefList();

                        });
                });

            });
    };

    var expediaSearch = function() {
        var city = $('#city').val();
        var country = $('#country').val();
        $.get(host + '/hotelpreferences/expediaSearch?city='+city+'&country='+country,
            function (data, succes) {


            }
        )
    };

    // $('#submitLocation').click(function () {
    //     $('#submitLocation').prop('disabled', true);
    //     getLocationList(username);
    //
    // });

    
    getPrefList();
    getLocationList(username);
});
