'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const {Transaction} = require('./models');

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

const {checkDate, checkTransaction} = require('./checks');


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

	if (!checkDate(year, month, day)) {
		return res.status(422).json({message: 'Invalid date.'});
	}

	let transactionCheck = checkTransaction(type, amount, recipient, source);
	if (transactionCheck) {
		return res.status(422).json({message: transactionCheck});
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

//updates transactions
router.put('/', jwtAuth, jsonParser, (req, res) => {

})

//deletes transactions
router.delete('/', jwtAuth, jsonParser, (req, res) => {
	Transaction
		.findById(req.body.id)
		.then(transaction => {
			if (transaction.userId !== req.user._id) {
				return res.status(422).json({message: 'Ids do not match.'});
			}
			
			return Transaction.findByIdAndRemove({_id: req.body.id}).then(() => res.status(200).json({message: 'Successfully deleted.'}));})
		.catch(err => {
			console.log(err);
			return res.status(500).json({code: 500, message: err});
		});
});

module.exports = router;