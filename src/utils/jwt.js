const jwt = require('jsonwebtoken');

module.exports = {
	sign: (data, key = process.env.JWT_KEY, expiresIn = 1000 * 60 * 60 * 24) =>
		new Promise((resolve, reject) => {
			jwt.sign(
				data,
				key,
				{
					expiresIn: expiresIn / 1000,
				},
				(err, token) => {
					if (err) reject(err);
					else resolve(token);
				}
			);
		}),
	verify: (token, key = process.env.JWT_KEY) =>
		new Promise((resolve, reject) => {
			jwt.verify(token, key, (err, decoded) => {
				if (err) {
					if (err.name === 'JsonWebTokenError') reject(new Error('INVALID_TOKEN'));
					else if (err.name === 'TokenExpiredError') reject(new Error('TOKEN_EXPIRED'));
					else if (err.name === 'NotBeforeError') reject(new Error('TOKEN_NOT_ACTIVE_YET'));
				} else resolve(decoded);
			});
		}),
};
