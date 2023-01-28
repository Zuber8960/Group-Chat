
const express = require('express');

const router = express.Router();

const groupController = require('../controllers/group');
const authorization = require('../middleware/auth');

router.post('/createGroup', authorization.authentication,  groupController.createGroup);

router.get('/getGroup' , authorization.authentication , groupController.getGroups)

module.exports = router;