// const Router = require('express');
// const GreetingController = require('../controllers/greeting.controller');
// const { upload } = require('../services/s3.service');
// const router = new Router();

// router.post('/greeting', upload.single(), GreetingController.createGreeting);
// router.get('/greeting', GreetingController.fetchGreeting);
// router.patch('/greeting/:id', GreetingController.updateThroughPatchReq);
// router.put('/greeting', GreetingController.fetchGreeting);

// module.exports = router;

const Router = require('express');
const GreetingController = require('../controllers/greeting.controller');
const { upload } = require('../services/s3.service');
const router = new Router();

router.post(
	'/greeting',
	upload.single('image'),
	GreetingController.createGreeting
);
router.get('/greeting', GreetingController.fetchGreeting);
router.patch(
	'/greeting/:id',
	upload.single('image'),
	GreetingController.updateThroughPatchReq
);
router.put('/greeting', GreetingController.fetchGreeting);

module.exports = router;
