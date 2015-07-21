'use strict';

var router = require('express').Router();
var User = require('../api/users/user.model');

router.use('/google', require('./google.oauth'));

router.get('/logout', function (req, res, next) {
	//req.session.userId = null;
	req.logout(function (){
		res.status(200).end();
	})
});

router.post('/login', function (req, res, next) {
	// find user by email and password
	// if they exist send them back to the frontend
	// if they don't error 401
	User.findByEmail(req.body.email).exec()
	.then(function (user) {
		if (user && user.authenticate(req.body.password)) {
			// req.session.userId = user._id;
			req.login(user, function(){
				res.json(user);
			}); //req.logn is from passport.initialize() and triggers passport.serializeUser callback function
			return;
		}
		// did not find user
		var err = new Error('Not Authenticated');
		err.status = 401;
		next(err);
	})
	// error with query/db
	.then(null, next);
});

router.post('/signup', function (req, res, next) {
	delete req.body.isAdmin;
	User.create(req.body)
	.then(function (user) {
		//req.session.userId = user._id;
		req.login(user, function(){
			res.status(201).json(user);
		})
	})
	.then(null, next);
});


module.exports = router;