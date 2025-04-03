const Router = require('express')
const FeedbackController = require('../controllers/feedback.controller')

const router = new Router()
router.get('/feedback', FeedbackController.getFeedback)
router.post('/feedback', FeedbackController.sendFeedback)
router.delete('/feedback', FeedbackController.clearFeedback)
router.delete('/feedback/:id', FeedbackController.removeFeedback)

module.exports = router
