/* eslint-disable no-param-reassign */
const logger = require('pino')();

module.exports = (opts) => {
	delete opts.service;
	const { requestId } = opts;
	opts = {
		service: process.env.npm_package_name,
		...opts,
	};

	return logger.child({
		service: opts.npm_package_name,
		module: opts.module || null,
		requestId,
	});
};
