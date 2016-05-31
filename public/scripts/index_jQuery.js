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
   
   
   setMostDesirable(); 
   setMostUnDesirable();
   setControversial();
   setMatched();
});


function setControversial()
{
    
    var category='electronics';
      $.get(host+'/controversial?category='+category+'&maxrows=5&trim=true',function(data,succes){
         
          $("#controversialPanel").html(data); 
      });
    
};


function setMatched()
{
    
    $("#most_matched").html("Waiting...");
    $.get(host+"/mostMatch?number=5&trim=true",function(data,succes){
       
        $("#most_matched").html(data);
         
    });
}

function setMostDesirable()
{
      var category='electronics';
      $.get(host+'/unloged/mostdesirable?category='+category+'&maxrows=3&trim=true',function(data,succes){
         
          $("#desirablePanel").html(data); 
      });
      category='cars';
      $.get(host+'/unloged/mostdesirable?category='+category+'&maxrows=3&trim=true',function(data,succes){
         
          $("#desirablePanel").append(data); 
      });
};


function setMostUnDesirable()
{
      var category='electronics';
      $.get(host+'/unloged/mostundesirable?category='+category+'&maxrows=3&trim=true',function(data,succes){
         
          $("#undesirablePanel").html(data); 
      });
      category='cars';
      $.get(host+'/unloged/mostundesirable?category='+category+'&maxrows=3&trim=true',function(data,succes){
         
          $("#undesirablePanel").append(data); 
      });
}