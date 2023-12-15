const v1 = require('express').Router();
// const auth = require('../../middleware/auth');
const example = require('./example');

// v1.use(auth);
v1.use('/example', example);

module.exports = v1;
