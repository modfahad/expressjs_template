const ExtendedError = require('../../errors/extendedError');

const getExampleHandler = async (deps) => {
	const { logger, auxiliaryParams, queryParams } = deps;

	try {
		const paramsObj = {};
		return {
			auxiliaryParams,
			queryParams,
			paramsObj,
		};
	} catch (error) {
		if (error instanceof ExtendedError) {
			throw error;
		}
		logger.error(error.message || 'An error occurred');
		throw new ExtendedError('INTERNAL SERVER ERROR', 500);
	}
};
module.exports = {
	getExampleHandler,
};
