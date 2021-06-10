'use strict';

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const Promise = require('bluebird');
const region = process.env.REGION;
const lambda = new AWS.Lambda({ region, apiVersion: '2015-03-31' });

// const invoke = (url, data) => {
// 	return new Promise((resolve, reject) => {
// 		const params = {
// 			FunctionName: url,
// 			InvocationType: 'RequestResponse',
// 			Payload: JSON.stringify(data),
// 		};
// 		lambda.invoke(params, (err, data) => {
// 			if (err) return reject(err);
// 			resolve(data);
// 		});
// 	});
// };

const invoke = (url, data) => {
	const params = {
		FunctionName: url,
		InvocationType: 'RequestResponse',
		Payload: JSON.stringify(data),
	};
	return lambda.invoke(params).promise();
};

module.exports = {
	invoke,
};
