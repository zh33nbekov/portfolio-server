const GreetingModel = require('../models/greeting.model');

class GreetingService {
	async createGreeting(newGreeting) {
		try {
			const { left, right } = newGreeting.buttons;
			const greeting = await GreetingModel.create({
				image: newGreeting.image, // Сохраняем ссылку на S3
				description: newGreeting.description,
				message: newGreeting.message,
				buttons: { left, right },
				subtitle: newGreeting.subtitle,
				title: newGreeting.title,
			});
			return greeting;
		} catch (error) {
			console.log(error);
			throw new Error('Ошибка при создании приветствия');
		}
	}

	async fetchGreeting(lang) {
		try {
			const greeting = await GreetingModel.findOne();
			return {
				image: greeting.image,
				message: greeting.message[lang],
				title: greeting.title[lang],
				subtitle: greeting.subtitle[lang],
				description: greeting.description[lang],
				buttons: {
					isDisabled: greeting.buttons.isDisabled,
					left: {
						title: greeting.buttons.left.title[lang],
						link: greeting.buttons.left.link,
					},
					right: {
						title: greeting.buttons.right.title[lang],
						link: greeting.buttons.right.link,
					},
				},
			};
		} catch (error) {
			console.error(error);
		}
	}

	async updateThroughPatchReq(id, updates) {
		try {
			const updatedGreeting = await GreetingModel.findByIdAndUpdate(
				id,
				updates,
				{ new: true } // Чтобы получить обновленный документ
			);
			return updatedGreeting;
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = new GreetingService();
