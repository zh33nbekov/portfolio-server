const MessageModel = require('../models/message.model');

class MessageService {
	async sendMessage(newMessage) {
		const message = await MessageModel.create(newMessage);
		return message;
	}
	async getMessages() {
		const messages = await MessageModel.find();
		return messages;
	}
}

module.exports = new MessageService();
