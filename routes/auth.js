const express = require('express');
const { getLogin, login, getRegister, register, logout , dashboard } = require('../controllers/auth');
const router = express.Router();
const { isAuthenticated } = require('../config/token.js');

router.get('/login' , getLogin);

router.post('/login', login);

router.get('/register' , getRegister);

router.post('/register', register);

router.get('/dashboard' , isAuthenticated , dashboard );

router.get('/logout' , logout);

module.exports = router;