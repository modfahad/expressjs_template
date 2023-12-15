const crypto = require('crypto');

const randomString = (r) => `${Date.now()}-${crypto.randomBytes(r).toString('hex')}`;

module.exports = {
	randomString,
};
