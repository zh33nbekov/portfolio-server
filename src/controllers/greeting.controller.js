const jsonParser = require('../helpers/jsonParser');
const GreetingService = require('../services/greeting.service');
const { uploadToS3 } = require('../services/s3.service');

class GreetingController {
	async createGreeting(req, res, next) {
		try {
			const imageUrl = req.file ? await uploadToS3(req.file) : null;
			const {
				message,
				title,
				subtitle,
				description,
				buttons: { left, right },
			} = jsonParser(req.body);

			const greeting = await GreetingService.createGreeting({
				image: imageUrl,
				message,
				title,
				subtitle,
				description,
				buttons: { left, right },
			});
			res.json(greeting);
		} catch (error) {
			console.log(error);
			next(error);
		}
	}

	async fetchGreeting(req, res, next) {
		try {
			const { lang = 'ru' } = req.query;
			const greeting = await GreetingService.fetchGreeting(lang);
			res.json(greeting);
		} catch (error) {
			next(error);
		}
	}

	async updateThroughPatchReq(req, res, next) {
		try {
			const { id } = req.params;
			const updates = req.body;
			const image = req.file ? req.file.location : null; // Обновляем изображение, если есть

			if (image) {
				updates.image = image;
			}

			const greeting = await GreetingService.updateThroughPatchReq(
				id,
				updates
			);
			res.json(greeting);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new GreetingController();
