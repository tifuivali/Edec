 var host="http://localhost:3000";
 $(document).ready(function(){
      $("#adauga").click(function() {
               var key=$("#key").val()
               var page=$("#page").val();
               $.get(host+"/insert/electronics/?keywords="+key+"&page="+page, function(data, status){
                     $("#status").html(status);
                     $("#result").text(data);
                     $("#page").val(parseInt(page)+1);
                     });
              });
       });
       

