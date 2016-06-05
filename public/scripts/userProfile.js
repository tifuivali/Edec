//var host="http://localhost:3000";
var host='http://edec2016.ddns.net';
$(document).ready(function(){
   
   var username=$("#username").text();
   var category=$('#category').val();
   var page=$("#page_nr").val();
   var getReviews=function(username,category){
   $.get(host+'/userprofile/reviews?username='+username+'&category='+category+'&page='+page,
        function(data,succes){
          
            $("#reviewpanel").html(data);
              
        });
   };
   
   $("#export_csv").click(function()
   {
       category=category.toUpperCase();
        $("#state").html('Exporting..'); 
       $.get(host+'/userprofile/export?category='+category,function(data,succes){
          
           $("#state").html(data); 
       });
       
   });
   
   $("#next").click(function()
   {
       username=$("#username").text();
       category=$('#category').val();
       page=parseInt($("#page_nr").val())+1;
       getReviews(username,category);
       $("#page_nr").val(page);
   });
   
   getReviews(username,category);
    
   $("#category").change(function(){
       
       category=$(this).val();
       getReviews(username,category);
   });
   
   
   $("#button_add_preferences").click(function(){
      
      var category=$("#categoryPreferences").val();
      $("#addpreferenceBox").text(category); 
      if(category=="electronics")
        addElectronicPreference();
       
   });
   
   getUserPreference();
   
   setImageProfile();
  
    
});

function addElectronicPreference()
{
    $.get(host+"/electronics/getAddElectronicsPreferencesBox",function(data,succes){
        
        $("#userpreference").html(data); 
    });
}


function getUserPreference()
{
    $.get(host+"/electronics/userpreferences",function(data,succes){
        $("#userpreference").html(data);
    });
    
}

function setImageProfile()
{
    $.get(host+"/userprofile/profileimg",function(data,succes){
       
        $("#profileIMG").attr({
           src:data 
        });
         
    });
}





