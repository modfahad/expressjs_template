const { getResponseObj } = require('../../utils/responseUtils');

// eslint-disable-next-line no-shadow
const injectResponsefulError = ({ getResponseObj }) => {
	class ExtendedError extends Error {
		constructor(message, code = 500, headers = {}, extra = {}) {
			super(message);
			this.name = 'ExtendedError';
			this.responseObj = getResponseObj(
				code,
				{
					message,
					...extra,
				},
				headers
			);
		}
	}

	return ExtendedError;
};

module.exports = injectResponsefulError({
	getResponseObj,
});
