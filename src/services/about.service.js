const AboutModel = require('../models/about.model')
const { uploadToS3 } = require('./s3.service')

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
			return { image: about.image, description: about.description[lang], id: about.id }
		} catch (error) {
			console.log(error)
		}
	}
	async updateThroughPtchReq(id, lang, updates) {
		try {
			const updateData = {}
			if (updates.image) {
				const imageUrl = await uploadToS3(updates.image)
				updateData.image = imageUrl
			}
			const multiLangFields = ['description']
			multiLangFields.forEach((field) => {
				if (updates[field]) {
					updateData[`${field}.${lang}`] = updates[field]
				}
			})
			const updatedAbout = await AboutModel.findByIdAndUpdate(
				id,
				{ $set: updateData },
				{ new: true, runValidators: true }
			)
			return updatedAbout
		} catch (error) {
			console.log(error)
			throw error
		}
	}
}

module.exports = new AboutService()
