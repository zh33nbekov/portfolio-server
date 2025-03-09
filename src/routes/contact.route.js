const Router = require('express')
const ContactController = require('../controllers/contact.controller')
const { upload } = require('../services/s3.service')
const router = new Router()

router.post('/contact', upload.single('image'), ContactController.createContact)
router.get('/contact', ContactController.fetchContact)
router.patch('/contact/:id', upload.single('image'), ContactController.updateThroughPtchReq)

module.exports = router
