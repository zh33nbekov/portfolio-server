const MessageService = require('../services/message.service');

class MessageController {
	async sendMessage(req, res, next) {
		try {
			const { name, email, message: reqMsg } = req.body;
			const message = await MessageService.sendMessage({
				name,
				email,
				message: reqMsg,
			});
			res.json({ message, info: 'Успешо отправлен' });
		} catch (error) {
			next(error);
		}
	}
	async getMessages(req, res, next) {
		try {
			const messages = await MessageService.getMessages();
			res.json(messages);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new MessageController();
