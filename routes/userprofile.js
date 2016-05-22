var express = require('express');
var router = express.Router();

/* GET home page. */
usernameToSend="valeria";
router.get('/', function(req, res, next) {
    res.render('userprofile', { title: 'userprofile',logged:1,username:usernameToSend });
});

module.exports = router;

