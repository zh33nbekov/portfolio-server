const AboutModel = require('../models/about.model')

class AboutService {
	async createAbout(newAbout) {
		try {
			const { image, description } = newAbout
			const about = await AboutModel.create({ image, description })
			return about
		} catch (error) {
			console.log(error)
		}
	}
	async fetchAbout(lang) {
		try {
			const about = await AboutModel.findOne()
			return { image: about.image, description: about.description[lang] }
		} catch (error) {
			console.log(error)
		}
	}
	async updateThroughPtchReq(id, updates) {
		try {
			const updatedAbout = await AboutModel.findByIdAndUpdate(id, updates)
			return updatedAbout[0]
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new AboutService()
