
//var host='http://localhost:3000';
var host='http://edec2016.ddns.net';

$(document).ready(function()
{
   $("#bSearch").click(function()
   {
       var key=$("#search").val();
       var category=$("#category").val();
       $.get(host+'/search?keyword='+key+'&category='+category,function(data,succes){
           
           $("#body").html(data);
       });
        
   });
    
});