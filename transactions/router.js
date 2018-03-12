'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

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
    
	const {type, year, month, day, currency, amount, memo, source, recipient, category, recurring} = req.body;
    
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

	res.status(200).json({message: 'working'});
});

module.exports = router;