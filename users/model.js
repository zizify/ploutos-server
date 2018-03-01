const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	currency: {type: String, default: 'USD'},
	location: {type: String, default: null},
	ratio: {type: Object, default: {savings: 0.2, wants: 0.3, needs: 0.5}}
});

UserSchema.methods.serialize = function() {
	return {
		username: this.username || '',
		firstName: this.firstName || '',
		lastName: this.lastName || '',
		email: this.email || '',
		currency: this.currency || '',
		location: this.location || '',
		ratio: this.ratio || null
	};
};

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};