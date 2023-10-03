const { user } = require('../model/user');
const usercontroller = require('../controller/user');
const { auth } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/signup', usercontroller.signup)

router.post('/login', usercontroller.login)

router.put('/forgotpassword', usercontroller.forgotpassword)

router.put('/setpassword', usercontroller.setpassword)

router.put('/changepassword', auth, usercontroller.changepassword)

router.post('/createuser', auth, usercontroller.createuser)

router.get('/getuser/:id', auth, usercontroller.getuserbyid)

router.get('/getall', usercontroller.getalluser)

router.put('/deluser', auth, usercontroller.deleteuserbyid)

module.exports = router;