var host="http://localhost:3000";
    $(document).ready(function(){

        var username=$("#username").text();
        var category=$('#category').val();
        var page=$("#page_nr").val();
        var getReviews=function(username,category,page){
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
       getReviews(username,category,$("#page_nr").val());
       $("#page_nr").val(page);
   });
   
   getReviews(username,category,1);
    
   $("#category").change(function(){
       
       category=$(this).val();
       getReviews(username,category,1);
   });
   
   
   $("#button_add_preferences").click(function(){
      
      var category=$("#categoryPreferences").val();
      $("#addpreferenceBox").text(category); 
      if(category=="electronics")
        addElectronicPreference();
       
   });

    $('#page_nr').keypress(function(event){
        if(event.keyCode == '13'){
            var n = $('#page_nr').val();
            if(!isNaN(parseFloat(n)) && isFinite(n)){
                getReviews(username,$('#category').val(), $("#page_nr").val())
            }
        }
    })

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





