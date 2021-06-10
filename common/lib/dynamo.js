'use strict';

const AWS = require('aws-sdk');

const dev = {
	// region: 'localhost',
	region: 'sa-east-1',
	// endpoint: 'http://localhost:8000',
	accessKeyId: 'AKIA3HPWWSDGMD3YKOGQ',
	secretAccessKey: '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',
	// convertEmptyValues: true,
};

const prod = { region: process.env.REGION || 'sa-east-1' };

const config = process.env.IS_OFFLINE ? dev : prod;
// const config = dev;
AWS.config.update(config);

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * DynamoDB Client Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @save() - Register Item on DynamoDB
 * @find() - Find Register by Key
 * @query() - Execute DynamoDB Query
 * @update() - Execute a DynamoDB Update
 * @TODO @scan() - Execute DynamoDB Scan
 * @TODO @removeRow() - Delete a single row using Key
 */

const save = async (params) => {
	try {
		await dynamodb.put(params).promise();
		return params;
	} catch (error) {
		console.log(
			'Unable to create item in table. Error JSON:',
			JSON.stringify(error, null, 2)
		);
		console.log('Rejection for:', JSON.stringify(params, null, 2));
		throw new Error();
	}
};

const update = async (params) => {
	try {
		let aa = await dynamodb.update(params).promise();
		return aa;
	} catch (error) {
		console.log(
			'Unable to create item in table. Error JSON:',
			JSON.stringify(error, null, 2)
		);
		console.log('Rejection for:', JSON.stringify(params, null, 2));
		throw new Error();
	}
};

const find = async (params) => {
	try {
		let bb = await dynamodb.get(params).promise();
		return bb;
	} catch (error) {
		console.log(
			'Unable to create item in table. Error JSON:',
			JSON.stringify(error, null, 2)
		);
		console.log('Rejection for:', JSON.stringify(params, null, 2));
		throw new Error();
	}
};

const list = async (params) => {
	try {
		let aa = await dynamodb.query(params).promise();
		return aa;
	} catch (error) {
		console.log(
			'Unable to create item in table. Error JSON:',
			JSON.stringify(error, null, 2)
		);
		console.log('Rejection for:', JSON.stringify(params, null, 2));
		throw new Error();
	}
};

const scan = async (params) => {
	try {
		return await dynamodb.scan(params).promise();
	} catch (error) {
		console.log(
			'Unable to create item in table. Error JSON:',
			JSON.stringify(error, null, 2)
		);
		console.log('Rejection for:', JSON.stringify(params, null, 2));
		throw new Error();
	}
};

module.exports = {
	save,
	update,
	find,
	list,
	scan,
};
