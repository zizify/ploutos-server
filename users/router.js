'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const {User} = require('./model');

router.post('/', jsonParser, (req, res) => {
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
			console.log(err);
			return res.status(500).json({code: 500, message: 'Internal server error'});
		});
});

module.exports = router;