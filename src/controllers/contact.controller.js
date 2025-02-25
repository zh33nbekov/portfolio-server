const ContactService = require('../services/contact.service');
const { uploadToS3 } = require('../services/s3.service');

class ContactController {
	async createContact(req, res, next) {
		try {
			const imageUrl = req.file ? await uploadToS3(req.file) : null;
			const contact = await ContactService.createContact(image);
			res.json(contact);
		} catch (error) {
			next();
			console.log(error);
		}
	}
	async fetchContact(req, res, next) {
		try {
			const contact = await ContactService.fetchContact();
			res.json(contact);
		} catch (error) {
			console.log(error);
			next();
		}
	}
	async updateThroughPtchReq(req, res, next) {
		try {
			const { id } = req.params;
			const updates = req.body;
			const contact = await ContactService.updateThroughPtchReq(id, updates);
			res.json(contact);
		} catch (error) {
			console.log(error);
		}
	}
}
module.exports = new ContactController();
