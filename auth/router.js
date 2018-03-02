'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const { User } = require('../users/model');

const config = require('../config');
const router = express.Router();

const createAuthToken = function (user) {
	return jwt.sign({ user }, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256',
	});
};

router.use(jsonParser);

const localAuth = passport.authenticate('local', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	User.findOne({ username: req.user.username })
		.then(() => { return res.json({authToken});});
});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	res.json({ authToken });
});

module.exports = {router};
