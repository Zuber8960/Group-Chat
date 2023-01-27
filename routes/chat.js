
const express = require('express');

const router = express.Router();

const chatController = require('../controllers/chat')
const authorization = require('../middleware/auth');

router.post('/sendMessage', authorization.authentication,  chatController.sendMessage);

router.get('/getMessage' , authorization.authentication,  chatController.getMessage);

module.exports = router;