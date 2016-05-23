var host="http://localhost:3000";
$(document).ready(function(){
   
   var username=$("#username").text();
   var category=$('#category').val();
   
   var getReviews=function(username,category){
   $.get(host+'/userprofile/reviews?username='+username+'&category='+category,
        function(data,succes){
          
            $("#reviewpanel").html(data);
              
        });
   };
   
   getReviews(username,category);
    
   $("#category").change(function(){
       
       category=$(this).val();
       getReviews(username,category);
   });
    
});

