const Router = require('express')
const AuthController = require('../controllers/auth.controller')
const router = new Router()

router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/refresh', AuthController.refresh)

module.exports = router
