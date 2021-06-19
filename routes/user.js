const express = require('express');
const router = express.Router();
const {loginUser, createUser} = require('../controller/user');
const {validateInput} = require('../middleware/user');


//login
router.post('/login', validateInput, loginUser);

//signup
router.post('/signup', validateInput, createUser);

module.exports = router;