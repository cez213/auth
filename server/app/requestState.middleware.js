'use strict'; 

var router = require('express').Router(),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	passport = require('passport');

var User = require('../api/users/user.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.use(session({
	secret: require('../../config').sessionSecret,
	cookie: {
		secure: true,
		resave: false,
		saveUninitialized: false
	}
}));

//callback function gets triggered when done is called in sign on user (google.oauth.js)
passport.serializeUser(function (user, done){
	//done ==> arguments: err, whaterver you want to attach to the session
	//done attaches to session the user id
	done(null, user._id);
});

//whatever we deserialize gets attached as req.user
passport.deserializeUser(function (id, done){
	User.findById(id, done); //done -> bind as req.user
})

//use passport with express app
router.use(passport.initialize());
//use passport with session
router.use(passport.session());


module.exports = router;