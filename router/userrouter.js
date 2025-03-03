import express from 'express';
const user = express.Router();
import { register, login ,totalUser} from '../control/userCtrl.js';

// Removed profile picture logic
user.post('/register', register);

user.post('/login', login);
user.get('/totaluser',totalUser)
module.exports = user;
