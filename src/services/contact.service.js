const ContactModel = require('../models/contact.model')

class ContactService {
	async createContact(image) {
		try {
			const contact = await ContactModel.create({ image })
			return contact
		} catch (error) {
			console.log(error)
		}
	}
	async fetchContact() {
		try {
			const contact = await ContactModel.findOne()
			return contact
		} catch (error) {
			console.log(error)
		}
	}
	async updateThroughPtchReq(id, updates) {
		try {
			const updatedContact = await ContactModel.findByIdAndUpdate(id, updates)
			return updatedContact[0]
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new ContactService()
