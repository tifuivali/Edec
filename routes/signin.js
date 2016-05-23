var express = require('express');
var router = express.Router();

/* GET home page. */
var usernameToSend="valeria";
router.get('/', function(req, res, next) {
    res.render('signin', { title: 'sign in',logged:0,username:usernameToSend });
});


module.exports = router;
