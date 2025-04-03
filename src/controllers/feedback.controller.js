const FeedbackService = require('../services/feedback.service')

class FeedbackController {
	async sendFeedback(req, res, next) {
		try {
			const lang = req.acceptsLanguages()[0]
			console.log(lang)
			const { name, email, message: reqMsg } = req.body
			await FeedbackService.sendFeedback({
				name,
				email,
				message: reqMsg,
			})
			res.json({ info: lang === 'ru' ? 'Успешно отправлен' : 'Successfully sent' })
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
	async clearFeedback(req, res, next) {
		try {
			await FeedbackService.clearFeedback()
			res.json({ info: 'Все объекты удалены' })
		} catch (error) {
			next(error)
		}
	}
	async removeFeedback(req, res, next) {
		try {
			const { id } = req.params
			await FeedbackService.removeFeedback(id)
			res.json({ info: 'Успешно удалено' })
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new FeedbackController()
