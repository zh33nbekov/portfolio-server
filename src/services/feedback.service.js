const FeedbackModel = require('../models/feedback.model')

class FeedbackService {
	async sendFeedback(newFeedback) {
		const feedback = await FeedbackModel.create(newFeedback)
		return feedback
	}
	async getFeedback() {
		const feedback = await FeedbackModel.find()
		return feedback
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
