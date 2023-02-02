
const express = require('express');

const router = express.Router();

const groupController = require('../controllers/group');
const authorization = require('../middleware/auth');

router.post('/createGroup', authorization.authentication,  groupController.createGroup);

router.get('/getGroup' , authorization.authentication , groupController.getGroups)

router.get('/delete/:id' ,  authorization.authentication, groupController.deleteGroup);

router.post('/getAllGroups' , groupController.getAllGroups);

router.get('/join/:id' , authorization.authentication , groupController.joinGroup);

module.exports = router;