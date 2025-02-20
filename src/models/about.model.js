const { Schema, model } = require('mongoose');

const About = new Schema({
	image: { type: String, required: true },
	description: {
		en: { type: String, required: true },
		ru: { type: String, required: true },
	},
});

module.exports = model('About', About, 'about');
