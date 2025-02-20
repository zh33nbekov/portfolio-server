const { Schema, model } = require('mongoose');

const Greeting = new Schema({
	image: { type: String },
	message: {
		en: { type: String, required: true },
		ru: { type: String, required: true },
	},
	title: {
		en: { type: String, required: true },
		ru: { type: String, required: true },
	},
	subtitle: {
		en: { type: String, required: true },
		ru: { type: String, required: true },
	},
	description: {
		en: { type: String, required: true },
		ru: { type: String, required: true },
	},
	buttons: {
		isDisabled: { type: Boolean },
		left: {
			title: {
				en: { type: String, required: true },
				ru: { type: String, required: true },
			},
			link: { type: String, required: true },
		},
		right: {
			title: {
				en: { type: String, required: true },
				ru: { type: String, required: true },
			},
			link: { type: String, required: true },
		},
	},
});

module.exports = model('Greeting', Greeting, 'greeting');
