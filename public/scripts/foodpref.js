var host = "http://localhost:3000";
$(document).ready(function () {

    var username = $("#username").text();

    $("#submit").click(function () {
        var preferences = assembleResponse();
        $.post(host+"/foodpreferences", preferences);
    });

    function assembleResponse(){
        var preferences = {};
        preferences.nitrogen_min = parseInt($('input[name="nitrogen_min"]').val());
        preferences.nitrogen_max = parseInt($('input[name="nitrogen_max"]').val());
        preferences.carbohydrate_min = parseInt($('input[name="carbohydrate_min"]').val());
        preferences.carbohydrate_max = parseInt($('input[name="carbohydrate_max"]').val());
        preferences.fat_min = parseInt($('input[name="fat_min"]').val());
        preferences.fat_max = parseInt($('input[name="fat_max"]').val());
        preferences.protein_min = parseInt($('input[name="protein_min"]').val());
        preferences.protein_max = parseInt($('input[name="protein_max"]').val());
        return preferences;
    }

});
