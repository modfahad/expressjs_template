const mongo = require('./services/common/mongoDbWrapper');
const ExtendedError = require('./errors/extendedError');

let db = null;

module.exports = async () => {
	if (db) {
		return db;
	}
	try {
		db = await mongo(process.env.DB_URI, process.env.DB_NAME);
		return db;
	} catch (e) {
		throw new ExtendedError(e.message, 500);
	}
};
