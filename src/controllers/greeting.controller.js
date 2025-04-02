const jsonParser = require('../helpers/jsonParser')
const GreetingService = require('../services/greeting.service')
class GreetingController {
	async createGreeting(req, res, next) {
		try {
			const image = req.file
			const {
				message,
				title,
				subtitle,
				description,
				buttons: { left, right },
			} = jsonParser(req.body)

			const greeting = await GreetingService.createGreeting({
				image,
				message,
				title,
				subtitle,
				description,
				buttons: { left, right },
			})
			res.json(greeting)
		} catch (error) {
			console.log(error)
			next(error)
		}
	}

	async fetchGreeting(req, res, next) {
		try {
			const lang = req.acceptsLanguages()
			const greeting = await GreetingService.fetchGreeting(lang)
			res.json(greeting)
		} catch (error) {
			next(error)
		}
	}

	async updateThroughPatchReq(req, res, next) {
		try {
			const lang = req.acceptsLanguages()
			const image = req.file
			const { id } = req.params
			const updates = jsonParser(req.body)
			const greeting = await GreetingService.updateThroughPatchReq(id, lang, {
				...updates,
				image,
			})
			res.json(greeting)
		} catch (error) {
			console.log(error)
			next(error)
		}
	}
}

module.exports = new GreetingController()
