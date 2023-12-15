module.exports = {
	nullResponseObj: {
		code: 404,
		nullObject: true,
		headers: {},
		data: {
			success: false,
			data: null,
			error: {
				message: 'Route not found',
			},
		},
	},
	getResponseObj: (code = 500, data = {}, headers = {}) => {
		const isSuccessful = code < 400;
		return {
			code,
			headers,
			data: {
				success: isSuccessful,
				data: isSuccessful ? data : null,
				error: isSuccessful ? null : data,
			},
		};
	},
};
