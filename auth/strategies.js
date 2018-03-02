'use strict';
const passport = require('passport');
const { User } = require('../users/model');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { validatePassword } = require('../users/model');
const { JWT_SECRET, DATABASE } = require('../config');

const { dbGet } = require('../db-mongoose');

const localStrategy = new LocalStrategy((username, password, callback) => {
	let user;
	User.findOne({ username: username }).then(_user => {
		user = _user;
		if (!user) {
			// Return a rejected promise so we break out of the chain of .thens.
			// Any errors like this will be handled in the catch block.
			return Promise.reject({ reason: 'LoginError', message: 'Incorrect username or password' });
		}

		return user.validatePassword(password);
	}).then(isValid => {
		if (!isValid) {
			return Promise.reject({ reason: 'LoginError', message: 'Incorrect username or password' });
		}

		return callback(null, user);
	}).catch(err => {
		if (err.reason === 'LoginError') {
			return callback(null, false, err);
		}

		return callback(err, false);
	});
});

const jwtStrategy = new JwtStrategy({
	secretOrKey: JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
	algorithms: ['HS256'],
}, (payload, done) => {
	done(null, payload.user);
});

module.exports = {
	jwtStrategy,
	localStrategy,
};
