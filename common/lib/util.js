'use strict';
const _ = require('lodash');
const moment = require('moment-timezone');

const generateUpdateQuery = (fields) => {
	let exp = {
		UpdateExpression: 'set',
		ExpressionAttributeNames: {},
		ExpressionAttributeValues: {},
	};
	Object.entries(fields).forEach(([key, item]) => {
		exp.UpdateExpression += ` #${key} = :${key},`;
		exp.ExpressionAttributeNames[`#${key}`] = key;
		exp.ExpressionAttributeValues[`:${key}`] = item;
	});
	exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
	return exp;
};

const getDateFormated = () => {
	return moment
		.tz(new Date(), 'America/Sao_Paulo')
		.format('YYYY-MM-DD HH:mm:ss');
};

const orderBy = (arrayObjects, config) => _.orderBy(arrayObjects, config);

const toCamelCase = (param) => _.camelCase(param);

module.exports = {
	generateUpdateQuery,
	getDateFormated,
	toCamelCase,
	orderBy,
};
