
const express = require('express');

const router = express.Router();

const chatController = require('../controllers/chat')
const authorization = require('../middleware/auth');

router.post('/sendMessage/:groupId', authorization.authentication,  chatController.sendMessage);

router.get('/getMessage/:groupId' , authorization.authentication,  chatController.getMessage);

router.get('/getUsers/:groupId' ,  chatController.getUsers);

router.post('/addUser/:groupId' , authorization.authentication ,  chatController.addUser);

router.post('/makeAdmin/:groupId' , authorization.authentication ,  chatController.makeAdmin);

router.post('/deleteUser/:groupId' , authorization.authentication ,  chatController.deleteUser);

router.post('/removeAdmin/:groupId' , authorization.authentication ,  chatController.removeAdmin);

module.exports = router;