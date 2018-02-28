const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	currency: {type: String, required: true, default: 'USD'},
	location: {type: String}
});

UserSchema.methods.serialize = function() {
	return {
		username: this.username || '',
		firstName: this.firstName || '',
		lastName: this.lastName || '',
	};
};

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};