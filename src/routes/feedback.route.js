const Router = require('express')
const FeedbackController = require('../controllers/feedback.controller')
const { default: rateLimit } = require('express-rate-limit')

const router = new Router()
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 час
	max: 5, // максимум 5 запросов
	message: 'Вы превысили лимит запросов. Попробуйте позже.',
	standardHeaders: true, // Отдаёт стандартные заголовки (RateLimit-*)
	legacyHeaders: false, // Отключает заголовки `X-RateLimit-*`
})

router.get('/feedback', FeedbackController.getFeedback)
router.post('/feedback', FeedbackController.sendFeedback)
router.delete('/feedback', FeedbackController.clearFeedback)
router.delete('/feedback/:id', FeedbackController.removeFeedback)

module.exports = router
