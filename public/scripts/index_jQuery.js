var host='http://localhost:3000';

$(document).ready(function(){
   
   var category_pozitive=$('#pozitive_category').val();
   var negative_category=$("#negative_category").val();
   
   var getPozitive=function(category){
   $.get(host+'/unloged/pozitiveReviews?category='+category_pozitive,
        function(data,succes){
          
            $("#pozitive_shadow").html(data);
              
        });
   };
   
   var getNegative=function(category){
   $.get(host+'/unloged/negativeReviews?category='+negative_category,
        function(data,succes){
          
            $("#negative_shadow").html(data);
              
        });
   };
   
   getPozitive(category_pozitive);
   getNegative(negative_category);
    
   $("#pozitive_category").change(function(){
       
       category_pozitive=$(this).val();
       getPozitive(category_pozitive);
   });
   
     $("#negative_category").change(function(){
       
       negative_category=$(this).val();
       getNegative(negative_category);
   });
    
});
