const { Schema, model } = require('mongoose');

const User = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
	},
	role: {
		type: String,
		default: 'USER',
	},
});

module.exports = model('User', User, 'users');
