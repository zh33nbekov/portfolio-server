const Router = require('express')
const AdminController = require('../controllers/admin.controller')

const router = new Router()
router.get('/me', AdminController.getAdminProfile)

module.exports = router
