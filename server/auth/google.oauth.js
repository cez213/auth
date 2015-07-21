'use strict';

var router = require('express').Router();
var passport = require('passport');
var User = require('../api/users/user.model');

//google authentication and login, note: scope is the permissions the app is requesting through google provider
router.get('/', passport.authenticate('google', {scope: 'email'}));

//handle the callback after google has authenticated the user
router.get('/callback', passport.authenticate('google', {
	successRedirect: '/stories',
	failureRedirect: '/signup'
}));

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
	new GoogleStrategy({
        clientID: '1009509533712-ovoesdnt5g6rjk9btrlm9ft80eafn803.apps.googleusercontent.com',
        clientSecret: require('../../config').googleClientSecret,
        callbackURL: 'https://localhost:8443/auth/google/callback'
    },
    // google will send back the token and profile (function runs when data comes back from google signin)
    function(token, refreshToken, profile, done) {
    	//find or create user
    	//if you create make sure you attach google data
    	//persist login via session

        //the callback will pass back user profilie information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object. 
        // find the user in the database based on their google id
        User.findOne({ 'google.id' : profile.id }, function(err, user){
        	if(err) done(err);
        	else if(user) /* update info if required */ done(null, user);
        	else{
        		console.log("profile:", profile)
        		var email = profile.emails[0].value;
        		User.create({
        			name: profile.displayName,
        			email: email,
        			photo: profile.photos[0].value,
        			google: {
        				id: profile.id,
        				token: token, //token to users info
        				name: profile.name.givenName,
        				email: profile.emails[0].value
        			}
        		}, done)
        	}
        })
    })
	);


module.exports = router;