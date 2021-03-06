const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
	userId: {type: String, required: true},
	type: {type: String, enum: ['income', 'expense', 'savings']},
	year: {type: Number, required: true},
	month: {type: Number, required: true, min: 1, max: 12},
	day: {type: Number, required: true, min: 1, max: 31},
	currency: {type: String, default: 'USD'},
	amount: {type: Number, required: true},
	memo: {type: String},
	source: {type: String},
	recipient: {type: String},
	category: {type: String, enum: ['housing', 'bills', 'loans', 'groceries', 'needs', 'entertainment', 'food & drink', 'savings', 'other'], required: true},
	recurring: {type: Boolean, required: true},
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = {Transaction};