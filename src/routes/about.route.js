const Router = require('express')
const AboutController = require('../controllers/about.controller')
const { upload } = require('../services/s3.service')
const router = new Router()

router.post('/about', upload.single('image'), AboutController.createAbout)
router.get('/about', AboutController.fetchAbout)
router.patch('/about/:id', upload.single('image'), AboutController.updateThroughPtchReq)

module.exports = router
