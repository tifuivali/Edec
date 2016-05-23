 var host="http://localhost:3000";
 
 var checkUsername=function(){
     var user=$("#username").val();
     $.post(host+"/verify/username",{username:user},function(data,success){
         
          $("#user_err").text(data);
          if(data==='ok')
            {isValidUser=true;
                checkisok();
            }
          else {
              isValidUser=false;
              checkisok();
          }  
         
     });
 };   

var isValidUser=false;
var isValidEmail=false;
var isValidPass=false;
var isValidConfirm=false;

function validateEmail(email) {
     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
};

function validatePassword(password)
{
    if(password.length<8)
      return false;
    return true;  
};

function validateConfirm()
{
  var pass_confirm=$("#confirm").val();
  var pass=$("#password").val();
  if(pass.localeCompare(pass_confirm)===0)
    {
        $("#confirm_err").text('');
        isValidConfirm=true;
        checkisok();
    }  
  else
  {
      $("#confirm_err").text('Passowrds not match.');
      isValidConfirm=false;
      checkisok();
  }
};
    
 $(document).ready(function(){
     $("#confirm").focusout(validateConfirm);
      $("#username").keyup(checkUsername);
      $("#email").keyup(function(){
         var email=$("#email").val();
         var res=validateEmail(email);
         if(res===false)
          {
              $("#email_err").text('Invalid Email.');
              isValidEmail=false;
              checkisok();
          } 
         else  
           {
               $("#email_err").text('');
               isValidEmail=true;
               checkisok();
           } 
      });
      $("#password").keyup(function(){
         var pass=$("#password").val();
         var res=validatePassword(pass);
         if(res===false)
          {
              $("#pass_err").text("Invalid Password");
              isValidPass=false;
              checkisok();  
          }
         else 
         {
             $("#pass_err").text("");
             isValidPass=true;
             checkisok();
         }
      });
      
 });   

 function checkisok()
 {
   if(isValidConfirm===true&&isValidEmail===true&&isValidPass===true&&isValidUser===true)
   {
       $("#status").text("");
       $("#register").prop("disabled",false);
   }
   else
   {
      $("#status").text("All fields shoud be validated.");
       $("#register").prop("disabled",true); 
   }  
 };