const ContactModel = require('../models/contact.model')
const { uploadToS3 } = require('./s3.service')

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
			return {
				image: contact.image,
				id: contact.id,
			}
		} catch (error) {
			console.log(error)
		}
	}
	async updateThroughPtchReq(id, image) {
		try {
			let imageUrl
			if (image) {
				imageUrl = await uploadToS3(image)
			}
			console.log(imageUrl)
			const updatedContact = await ContactModel.findByIdAndUpdate(
				id,
				{ image: imageUrl },
				{
					new: true,
					runValidators: true,
				}
			)
			return updatedContact
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new ContactService()
