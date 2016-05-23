var express = require('express');
var router = express.Router();

/* GET home page. */
var username='';
router.get('/', function(req, res, next) {
    if(req.session.username)
    {
        username=req.session.username;
        renderUserPage(req,res,username);
    } 
    else
     {
         res.render('userprofile', { title: 'userprofile',logged:0,
                    message:"You must be authenticated! ,please log in or register!"});
     }
});

///aici va fi randata pagina userului
////in functie de USERNAME
function renderUserPage(req,res,username)
{
    res.render('userprofile', { title: 'userprofile',logged:1,username:username});
};

module.exports = router;

