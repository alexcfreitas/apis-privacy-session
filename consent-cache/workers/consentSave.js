'use strict';

const redis = require('../lib/redis');

module.exports.run = async (event, context, callback) => {
	try {
		console.log(
			` **************** MsgQueue Successfully Received **************** `,
			JSON.stringify(event, null, 2)
		);
		const { method, key, consents } = event;
		if (method === 'GET') return await redis.get(key);
		let result = await redis.set(key, JSON.stringify(consents));
		if (result) {
			return { statusCodeProcess: 2001, result };
		}
	} catch (error) {
		throw new Error(error);
	}
};
