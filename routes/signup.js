var express = require('express');
var router = express.Router();

/* GET home page. */
usernameToSend="valeria";
router.get('/', function(req, res, next) {
    res.render('signup', { title: 'sign up',logged:0,username:usernameToSend });
});

module.exports = router;
