const express = require('express');

const router = express.Router()
const { signUp, logIn, updateUser, signOut } = require('../controllers/userController');
const authorization = require('../middleware/authorization');


router.post('/signup', signUp)

router.post('/login', logIn)

router.put('/update', authorization , updateUser)

router.put('/signout', authorization, signOut)

module.exports = router;