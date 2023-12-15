const example = require('express').Router();
const { exampleProcess } = require('../../lib/services/exampleService');

example.get('/', exampleProcess);

module.exports = example;
