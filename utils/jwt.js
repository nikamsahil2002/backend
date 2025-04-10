const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'qwertyuiopasdfghjklzxcvbnm';

exports.generateToken = (payload) => jwt.sign(payload, SECRET_KEY, {
  algorithm: 'HS256',
  expiresIn: 60 * 60 * 24,
});

exports.verifyToken = (token) => jwt.verify(token, SECRET_KEY);
