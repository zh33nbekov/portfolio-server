const { Schema, model } = require('mongoose');

const User = new Schema({
	fullName: { type: String, required: true },
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: 'USER',
	},
});

module.exports = model('User', User, 'users');
