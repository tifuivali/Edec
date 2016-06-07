

$(document).ready(function()
{
    var getMail = function () {
        $.get(host + '/notifications/getMail',
            function (data, succes) {

                $("#notif_div").html(data);


                $("tr").click(function() {
                    var values ='?email='+$(this).children()[0].innerHTML 
                        +'&date='+ $(this).children()[2].innerHTML;
                    $.get(host+ '/notifications/openEmail'+values,
                        function (data, succes) {

                            $("#notif_div").html(data);

                        })
                });

            });
    };
    
    getMail();
});
