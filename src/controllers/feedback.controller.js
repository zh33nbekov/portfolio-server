const FeedbackService = require('../services/feedback.service')

class FeedbackController {
	async sendFeedback(req, res, next) {
		try {
			const { name, email, message: reqMsg } = req.body
			await FeedbackService.sendFeedback({
				name,
				email,
				message: reqMsg,
			})
			console.log(req.body)
			res.json({ info: 'Успешно отправлен' })
		} catch (error) {
			next(error)
		}
	}
	async getFeedback(req, res, next) {
		try {
			const feedback = await FeedbackService.getFeedback()
			res.json(feedback)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new FeedbackController()
