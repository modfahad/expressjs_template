const express = require('express');
const url = require('url');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/routes');
const { nullResponseObj, getResponseObj } = require('./utils/responseUtils');
const ExtendedError = require('./lib/errors/extendedError');
const getLogger = require('./utils/logger');
const getDB = require('./lib/getDB');
const { randomString } = require('./utils/crypto_');

dotenv.config();

const externalMiddleware = {
	helmet,
	compression,
	cors,
};

const loggerHandler = async (req, res, next) => {
	try {
		req.loggerBody.responseTime = new Date();
		req.loggerBody.duration = req.loggerBody.responseTime.valueOf() - req.loggerBody.requestTime.valueOf();
		if (!('status' in req.loggerBody)) {
			req.loggerBody.status = true;
		}
		if (!res.locals.responseObj.nullObject) {
			req.loggerBody._id = req.loggerBody.requestId;
			delete req.loggerBody.requestId;
			req.db.create('logger', req.loggerBody);
		}
		next();
	} catch (err) {
		next();
	}
};
const ErrorHandler = (error, req, res, next) => {
	req.loggerBody.status = false;
	getLogger({
		module: 'error-handler',
		requestId: req.loggerBody.requestId,
	}).error({
		msg: 'Error caught in default error handler',
		error: {
			message: error.message,
		},
		...req.loggerBody,
	});
	if (error instanceof ExtendedError) {
		res.locals.responseObj = error.responseObj;
	} else {
		res.locals.responseObj = getResponseObj(500, {
			message: 'INTERNAL SERVER ERROR',
		});
	}

	next();
};

const responseHandler = (req, res) => {
	const { responseObj } = res.locals;
	getLogger({
		module: 'requests',
		requestId: req.loggerBody.requestId,
	}).info({
		msg: 'Response prepared',
		code: responseObj.code,
		headers: {
			...res.getHeaders(),
			...responseObj.headers,
		},
		data: responseObj.data,
		...req.loggerBody,
	});
	res.set(responseObj.headers);
	res.status(responseObj.code).send(responseObj.data);
};

module.exports = () => {
	const app = express();
	app.use(
		express.json({
			limit: '50mb',
		})
	);
	// eslint-disable-next-line array-callback-return
	Object.keys(externalMiddleware).map((i) => {
		app.use(externalMiddleware[i]());
	});
	app.use(async (req, res, next) => {
		const urlPath = url.parse(req.url).pathname.replace(/\d{1,20}$/gi, '');
		if (urlPath !== '/') {
			req.loggerBody = {
				requestId: randomString(7),
				requestTime: new Date(),
				urlPath,
				method: req.method,
			};
			getLogger({
				module: 'requests',
				requestId: req.loggerBody.requestId,
			}).info({
				msg: 'Request received',
				method: req.method,
				url: req.url,
				headers: req.headers,
				data: req.body,
				...req.loggerBody,
			});
			req.logger = getLogger({
				module: `routes${urlPath}`,
				requestId: req.loggerBody.requestId,
			});
			res.locals.responseObj = nullResponseObj;
			try {
				req.db = await getDB();
				next();
			} catch (e) {
				next(e);
			}
		} else {
			next();
		}
	});
	Object.keys(routes).forEach((route) => {
		app.use(`/${route}`, routes[route]);
	});
	app.get('/', (req, res) => {
		res.send({});
	});
	app.use(ErrorHandler);
	app.use(loggerHandler);
	app.use(responseHandler);

	return app;
};
