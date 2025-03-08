const jsonParser = require('../helpers/jsonParser')
const AboutService = require('../services/about.service')
const { uploadToS3 } = require('../services/s3.service')

class AboutController {
	async createAbout(req, res, next) {
		try {
			const imageUrl = req.file ? await uploadToS3(req.file) : null
			const { description } = jsonParser(req.body)
			const about = await AboutService.createAbout({
				image: imageUrl,
				description,
			})
			res.json(about)
		} catch (error) {
			next()
			console.log(error)
		}
	}
	async fetchAbout(req, res, next) {
		try {
			const { lang = 'ru' } = req.query
			const about = await AboutService.fetchAbout(lang)
			res.json(about)
		} catch (error) {
			console.log(error)
			next()
		}
	}
	async updateThroughPtchReq(req, res, next) {
		try {
			const { id } = req.params
			const { lang = 'ru' } = req.query
			const image = req.file
			const updates = req.body
			const about = await AboutService.updateThroughPtchReq(id, lang, { ...updates, image })
			console.log(image)
			res.json(about)
		} catch (error) {
			next()
			console.log(error)
		}
	}
}
module.exports = new AboutController()
