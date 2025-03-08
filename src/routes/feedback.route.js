const Router = require('express')
const FeedbackController = require('../controllers/feedback.controller')

const router = new Router()
router.post('/feedback', FeedbackController.sendFeedback)
router.get('/feedback', FeedbackController.getFeedback)

module.exports = router
