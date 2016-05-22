var express = require('express');
var router = express.Router();

/* GET home page. */
usernameToSend="valeria";
router.get('/', function(req, res, next) {
    res.render('about', { title: 'About',logged:1,username:usernameToSend });
});

module.exports = router;

