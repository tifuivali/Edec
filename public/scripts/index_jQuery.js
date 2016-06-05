//var host='http://localhost:3000';
var host='http://edec2016.ddns.net';

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
   getNegative(category_pozitive);



    $("#logged_pozitive_category").change(function(){

        var category=$(this).val();
        getMostMatchedToYou(category);
        getYouMightLike(category);
        getStayAwayFrom(category);
        setMostDesirable(category);
        setMostUnDesirable(category);
        setControversial(category);
        setMostMatched(category);
        
    });
    
   $("#pozitive_category").change(function(){
       
       category_pozitive=$(this).val();
       getPozitive(category_pozitive);
       getNegative(category_pozitive);
       var category=category_pozitive;
       getMostMatchedToYou(category);
       setMostDesirable(category);
       setMostUnDesirable(category);
       setControversial(category);
       setMostMatched(category);
       
   });
   
     $("#negative_category").change(function(){
       
       negative_category=$(this).val();
       getNegative(negative_category);
   });

    $(".review button").on("click", function(event){
        console.log(this.id.replace("up-votes",""))
        $.get("")
    });
    
    var category=$("#logged_pozitive_category").val();
    if(!category)
     category=category_pozitive;
    
    getMostMatchedToYou(category);
    getYouMightLike(category);
    getStayAwayFrom(category);
    setMostDesirable(category);
    setMostUnDesirable(category);
    setControversial(category);
    setMostMatched(category);
});

function getMostMatchedToYou(category){
    $.get(host+'/logged/mostMatcedToYou?category='+category,function(data,succes){

        $("#mostMatchedYourProfile").html(data);
    });
};


function getYouMightLike(category){
    $.get(host+'/logged/youmightlike?category='+category,function(data,succes){

        $("#you_might_like").html(data);
    }); 
};

function getStayAwayFrom(category){
    $.get(host+'/logged/stayawayfrom?category='+category,function(data,succes){

        $("#stay_away_from").html(data);
    });
};

function setMostMatched(category){
        var maxrows='5';
        $.get(host+'/unlogged/mostmatched?category='+category+'&maxrows?&trim=true',function(data,succes){
  
          $("#mostMatchedUsersProfiles").html(data);
        });

};


function setControversial(category)
{
    
          $.get(host+'/controversial?category='+category+'&maxrows=5&trim=true',function(data,succes){
         
          $("#controversialPanel").html(data); 
          });
      
};

function setMostDesirable(category)
{
      
      $.get(host+'/unloged/mostdesirable?category='+category+'&maxrows=3&trim=true',function(data,succes){
         
          $("#desirablePanel").html(data); 
      });
};


function setMostUnDesirable(category)
{
      
      $.get(host+'/unloged/mostundesirable?category='+category+'&maxrows=3&trim=true',function(data,succes){
         
          $("#undesirablePanel").html(data); 
      });
};
