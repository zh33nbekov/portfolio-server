const FeedbackModel = require('../models/feedback.model')

class FeedbackService {
	async sendFeedback(newFeedback) {
		const feedback = await FeedbackModel.create(newFeedback)
		return feedback
	}
	async getFeedback({ page = 1, limit = 10 }) {
		const skip = (page - 1) * limit

		const [data, total] = await Promise.all([
			FeedbackModel.find().skip(skip).limit(limit),
			FeedbackModel.countDocuments(),
		])

		return {
			data,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
			totalItems: total,
		}
	}
	async clearFeedback() {
		await FeedbackModel.deleteMany()
		return
	}
	async removeFeedback(id) {
		const feedback = await FeedbackModel.findByIdAndDelete(id)
		return feedback
	}
}

module.exports = new FeedbackService()
