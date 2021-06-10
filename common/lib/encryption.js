'use strict';

const uuidAPIKey = require('uuid-apikey');

const getId = () => uuidAPIKey.create().uuid.replace(/-/g, '');

const getApiKey = () => uuidAPIKey.create({ noDashes: true }).apiKey;

const validateApiKey = (key) => uuidAPIKey.isAPIKey(key);

module.exports = {
	getId,
	getApiKey,
	validateApiKey,
};
