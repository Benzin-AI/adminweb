const express = require('express');
const authCtrl = require('../controllers/auth.controller.js')
const { verifySecret } = require('../middlewares/auth.jwt');

const router = express.Router();

router.post('/signup', verifySecret, authCtrl.signUp);
router.post('/signin', authCtrl.signIn);


module.exports = router;
