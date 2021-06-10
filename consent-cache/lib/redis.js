'use strict';

const redis = require('redis');
const Promise = require('bluebird');

const local = {
	host: 'platform-prd-01.vk1iyo.ng.0001.sae1.cache.amazonaws.com',
	port: 6310,
	db: 1,
};

const prod = {
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	db: 1,
};

const options = process.env.IS_OFFLINE ? local : prod;

const client = redis.createClient(options);

const get = (key) => {
	return new Promise((resolve, reject) => {
		client.get(key, (err, reply) => {
			if (err) return reject(err);
			resolve(reply);
		});
	});
};

const set = (key, value) => {
	return new Promise((resolve, reject) => {
		client.set(key, value, (err) => {
			if (err) return reject(err);
			resolve({ key, value });
		});
	});
};

module.exports = {
	get,
	set,
};
