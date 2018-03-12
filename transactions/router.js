'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const {Transaction} = require('./models');

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

//creates new transactions
router.post('/', jwtAuth, jsonParser, (req, res) => {
	if (req.user._id !== req.body.userId) {
		return res.status(422).json({message: 'Ids do not match'});
	}

	const requiredFields = ['type', 'year', 'month', 'day', 'amount', 'memo', 'category', 'recurring'];
	requiredFields.forEach(field => {
		if (!req.body[field]) {
			return res.status(422).json({message: `${field} doesn't exist`});
		}
	});
    
	const {userId, type, year, month, day, currency, amount, memo, source, recipient, category, recurring} = req.body;

	if ((month < 0) || (month > 12)) {
		return res.status(422).json({message: 'Invalid month.'});
	}

	if (day < 0) {
		return res.status(422).json({message: 'Invalid day.'});
	}

	if (month === 2) {
		if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
			if (day > 29) {
				return res.status(422).json({message: 'Invalid day.'});
			}
		} else {
			if (day > 28) {
				return res.status(422).json({message: 'Invalid day.'});
			}
		}
	} else if ([4, 6, 9, 11].includes(month)) {
		if (day > 30) {
			return res.status(422).json({message: 'Invalid day.'});
		}
	} else {
		if (day > 31) {
			return res.status(422).json({message: 'Invalid day.'});
		}
	}
    
	if (!['income', 'expense', 'savings'].includes(type)) {
		return res.status(422).json({message: 'Invalid type'});
	} else if ((type === 'expense') || (type === 'savings')) {
		if (amount > 0) {
			return res.status(422).json({message: 'Amount should be zero or negative.'});
		} else if ((!recipient) || (source)) {
			return res.status(422).json({message: `Invalid source/recipient for ${type} transaction type.`});
		}
	} else if (type === 'income') {
		if (amount < 0) {
			return res.status(422).json({message: 'Amount should be zero or positive.'});
		} else if ((recipient) || (!source)) {
			return res.status(422).json({message: `Invalid source/recipient for ${type} transaction type.`});
		}
	}

	if (!['housing', 'bills', 'loans', 'groceries', 'needs', 'entertainment', 'food & drink', 'savings', 'other'].includes(category)) {
		return res.status(422).json({message: 'Invalid transaction category.'});
	}

	Transaction
		.create({userId, type, year, month, day, currency, amount, memo, source, recipient, category, recurring})
		.then(transaction => res.status(201).json(transaction))
		.catch(err => {
			return res.status(500).json({code: 500, message: err});
		});
});

module.exports = router;