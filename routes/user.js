
const express = require('express');

const router = express.Router();

const userController = require('../controllers/user')

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.post('/password' , userController.password);

router.use('/resetpassward/:id', userController.resetPassword);

router.get('/updatepassword/:id' , userController.updatePassword)

module.exports = router;