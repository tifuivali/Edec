

var host="http://localhost:3000/product/";
//var host='http://edec2016.ddns.net';


$(document).ready(function(){
   
   var query=$("#addReview").attr('name');
   var rev=$("#newReview").val();
   $("#addReview").click(function(){
       rev=$("#newReview").val();
       query=$("#addReview").attr('name');
       if(rev.length<=1)
       {
          alert("Set your review!");
          return; 
       }
       /*
       query+='&review='+rev;
       $.get(host+query,function(data,success){
          
          if(data)
          location.reload(true);
           
       });
       */
   
   });
 
   
   
    
});
    
    
    
    


function like(type, idReview, button){
    $.post(host+type+"/"+idReview+"/vote/1").done(function(response){
        if(response==0)
            return;
        likeSpan = $(button.parentElement).find('.glyphicon-thumbs-up')[0];
        dislikeSpan = $(button.parentElement).find('.glyphicon-thumbs-down')[0];
        if(response==1){
            likeSpan.textContent = 1+parseInt(likeSpan.textContent);
        }
        if(response==2){
            likeSpan.textContent = parseInt(likeSpan.textContent)-1;
        }
        if(response==3){
            likeSpan.textContent = parseInt(likeSpan.textContent)+1;
            dislikeSpan.textContent = parseInt(dislikeSpan.textContent)-1;
        }
    });
}

function dislike(type, idReview, button){
    $.post(host+type+"/"+idReview+"/vote/-1").done(function(response){
        if(response==0)
            return;
        likeSpan = $(button.parentElement).find('.glyphicon-thumbs-up')[0];
        dislikeSpan = $(button.parentElement).find('.glyphicon-thumbs-down')[0];
        if(response==1){
            dislikeSpan.textContent = 1+parseInt(dislikeSpan.textContent);
        }
        if(response==2){
            dislikeSpan.textContent = parseInt(dislikeSpan.textContent)-1;
        }
        if(response==3){
            dislikeSpan.textContent = parseInt(dislikeSpan.textContent)+1;
            likeSpan.textContent = parseInt(likeSpan.textContent)-1;
        }
    });
}