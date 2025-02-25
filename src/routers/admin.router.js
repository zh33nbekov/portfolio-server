const Router = require('express');
const AdminController = require('../controllers/admin.controller');

const router = new Router();
router.get('/me', AdminController.getAdminProfile);
// router.get('/me/:id', UserController.getUserProfile);

module.exports = router;
