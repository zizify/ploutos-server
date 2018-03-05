'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const {User} = require('./model');

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });


//Creates a new user.
router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['username', 'password', 'firstName', 'lastName', 'email'];
	requiredFields.forEach(field => {
		if (!req.body[field]) {
			return res.status(422).json({message: `${field} doesn't exist`});
		}
	});

	let {username, password, firstName, lastName, email, currency, location} = req.body;
    
	return User.find({username}).count().then(count => {
		if (count > 0) {
			return Promise.reject({code: 422, reason: 'Validation Error', message: 'Username already taken'});
		}
		return User.hashPassword(password);
	}).then(hash => {
		return User.create({username, password: hash, firstName, lastName, email, currency, location});
	}).then(user => res.status(201).json(user.serialize()))
		.catch(err => {
			return res.status(500).json({code: 500, message: 'Internal server error'});
		});
});

//Updates user expense ratio.
router.put('/ratio', jwtAuth, jsonParser, (req, res) => {
	const requiredFields = ['savings', 'needs', 'wants'];
	requiredFields.forEach(field => {
		if (!req.body.ratio[field]) {
			return res.status(422).json({message: `${field} doesn't exist`});
		}
	});

	let sum = Object.values(req.body.ratio).reduce((sum, value) => sum + value);
	
	if (sum !== 1) {
		return res.status(422).json({message: 'Ratio does not add up to 1.'});
	}

	return User
		.findOneAndUpdate({username: req.user.username}, {ratio: req.body.ratio})
		.then(() => res.status(200).end())
		.catch(err => {
			return res.status(500).json({code: 500, message: 'Internal server error'});
		});
});

module.exports = router;