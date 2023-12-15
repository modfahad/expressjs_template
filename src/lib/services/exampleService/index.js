const { getResponseObj } = require('../../../utils/responseUtils');
const { getExampleHandler } = require('./handler');
const ExtendedError = require('../../errors/extendedError');

const exampleProcess = async (req, res, next) => {
	const { logger } = req;
	const queryParams = req.params || {};
	const queryRequest = req.query || {};
	const auxiliaryParams = {};
	try {
		logger.info({
			...queryRequest,
			...queryParams,
		});
		if (!true) {
			throw new ExtendedError('Params Error', 400);
		}
		req.loggerBody.tel = queryParams.tel;
		const data = await getExampleHandler({ logger, queryParams, auxiliaryParams });
		res.locals.responseObj = getResponseObj(200, data);
		next();
	} catch (e) {
		logger.error(e.message || 'An error occurred');
		next(e);
	}
};

module.exports = { exampleProcess };
