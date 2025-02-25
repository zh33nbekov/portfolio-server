const GreetingModel = require('../models/greeting.model');
const { uploadToS3 } = require('./s3.service');

class GreetingService {
	async createGreeting(newGreeting) {
		try {
			const { image, description, message, subtitle, title } = newGreeting;
			const { left, right } = newGreeting.buttons;

			const imageUrl = image ? await uploadToS3(image) : '';

			const greeting = await GreetingModel.create({
				image: imageUrl,
				description,
				message,
				buttons: { left, right },
				subtitle,
				title,
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
				id: greeting.id,
			};
		} catch (error) {
			console.error(error);
		}
	}

	async updateThroughPutReq(id, lang, updates) {
		try {
			const updateFields = {};
			for (const key in updates) {
				updateFields[`${key}.${lang}`] = updates[key];
			}

			const updatedGreeting = await GreetingModel.findByIdAndUpdate(
				id,
				{ $set: updateFields },
				{ new: true, overwrite: true }
			);
			return updatedGreeting;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateThroughPatchReq(id, lang, updates) {
		try {
			const updateData = {};

			// 🔹 1. Обновление изображения (если передано)
			if (updates.image) {
				const imageUrl = await uploadToS3(updates.image);
				updateData.image = imageUrl;
			}

			// 🔹 2. Обновление текстовых мультиязычных полей
			const multiLangFields = [
				'message',
				'title',
				'subtitle',
				'description',
			];
			multiLangFields.forEach((field) => {
				if (updates[field]) {
					updateData[`${field}.${lang}`] = updates[field];
				}
			});

			// 🔹 3. Обновление кнопок
			if (updates.buttons) {
				if (updates.buttons.isDisabled !== undefined) {
					updateData['buttons.isDisabled'] = updates.buttons.isDisabled;
				}
				if (updates.buttons.left) {
					if (updates.buttons.left.title) {
						updateData[`buttons.left.title.${lang}`] =
							updates.buttons.left.title;
					}
					if (updates.buttons.left.link) {
						updateData[`buttons.left.link`] = updates.buttons.left.link;
					}
				}
				if (updates.buttons.right) {
					if (updates.buttons.right.title) {
						updateData[`buttons.right.title.${lang}`] =
							updates.buttons.right.title;
					}
					if (updates.buttons.right.link) {
						updateData[`buttons.right.link`] = updates.buttons.right.link;
					}
				}
			}

			// Проверка: если updateData пустой, выбрасываем ошибку
			if (Object.keys(updateData).length === 0) {
				throw new Error('No valid fields to update');
			}

			// 🔹 4. Обновление документа в базе
			const updatedGreeting = await GreetingModel.findByIdAndUpdate(
				id,
				{ $set: updateData },
				{ new: true, runValidators: true }
			);

			return updatedGreeting;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

module.exports = new GreetingService();
