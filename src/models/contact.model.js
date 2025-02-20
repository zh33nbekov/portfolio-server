const { Schema, model } = require('mongoose');

const Contact = new Schema({
	image: { type: String, required: true },
});

module.exports = model('Contact', Contact, 'contact');
