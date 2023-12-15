const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const ExtendedError = require('../lib/errors/extendedError');

const getUserData = async (req, user) => {
	try {
		const userList = await req.db.read(
			'users',
			{
				_id: {
					$in: [req.db.objectid(user.user_id), req.db.objectid(user._id)],
				},
			},
			'all',
			0
		);
		const [loginData] = userList.filter((i) => i.user_id);
		const [clientData] = userList.filter((i) => !i.user_id);
		if (!loginData) {
			throw new Error('Invalid Credentials');
		}
		const userData = {
			...loginData,
			config: {
				...(loginData.config || {}),
				...(clientData && clientData.config ? clientData.config : {}),
			},
		};
		delete userData.hash;
		req.loggerBody.user = userData.user;
		req.loggerBody.user_id = userData._id;
		return userData;
	} catch (e) {
		throw new Error(e.message);
	}
};
module.exports = async (req, res, next) => {
	const user = auth(req);
	if (user && user.name && user.pass) {
		req.user = user;
		try {
			const [userData] = await req.db.read('users', {
				_id: req.db.objectid(req.user.name),
			});
			const loginFlag = userData ? await bcrypt.compare(user.pass, userData.hash) : false;
			if (loginFlag) {
				req.user = await getUserData(req, userData);
				next();
			} else {
				next(new ExtendedError('Invalid Credentials', 403));
			}
		} catch (err) {
			next(new ExtendedError(`${err.message}`, 403));
		}
	} else if (req.headers.authorization) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const payload = await jwt.verify(token, process.env.JWT_KEY);
			req.user = await getUserData(req, payload);
			next();
		} catch (err) {
			next(new ExtendedError(`${err.message}`, 403));
		}
	} else {
		next(new ExtendedError(`No Auth`, 403));
	}
};
