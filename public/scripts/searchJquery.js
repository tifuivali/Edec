
var host='http://localhost:3000';

$(document).ready(function()
{
   $("#bSearch").click(function()
   {
       var key=$("#search").val();
       
       $.get(host+'/search?keyword='+key,function(data,succes){
           
           $("#body").html(data);
       });
        
   });
    
});