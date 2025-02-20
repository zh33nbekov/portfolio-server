const Router = require('express');
const MessageController = require('../controllers/message.controller');

const router = new Router();
router.post('/feedback', MessageController.sendMessage);
router.get('/feedback', MessageController.getMessages);

module.exports = router;
