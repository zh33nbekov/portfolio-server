const ContactService = require('../services/contact.service')
const { uploadToS3 } = require('../services/s3.service')

class ContactController {
	async createContact(req, res, next) {
		try {
			const imageUrl = req.file ? await uploadToS3(req.file) : null
			const contact = await ContactService.createContact(imageUrl)
			res.json(contact)
		} catch {
			next()
		}
	}
	async fetchContact(req, res, next) {
		try {
			const contact = await ContactService.fetchContact()
			res.json(contact)
		} catch {
			next()
		}
	}
	async updateThroughPtchReq(req, res, next) {
		try {
			const { id } = req.params
			const image = req.file
			const contact = await ContactService.updateThroughPtchReq(id, image)
			res.json(contact)
		} catch {
			next()
		}
	}
}
module.exports = new ContactController()
