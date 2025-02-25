const { Schema, model } = require('mongoose');

const Feedback = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	message: { type: String, required: true },
});

module.exports = model('Feedback', Feedback, 'feedback');
