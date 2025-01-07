const express = require('express');
const user = express.Router();
const { register, login ,totalUser} = require('../control/userCtrl');

// Removed profile picture logic
user.post('/register', register);

user.post('/login', login);
user.get('/totaluser',totalUser)
module.exports = user;
