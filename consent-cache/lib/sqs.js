'use strict';

const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const Promise = require('bluebird');
const endpoint = process.env.SQS_QUEUE_URL;

const local =
	'https://sqs.sa-east-1.amazonaws.com/772000878796/sqs-consent-management-cache-prod';

const dev = {
	apiVersion: '2012-11-05',
	region: 'sa-east-1',
	endpoint: local,
	sslEnabled: false,
	accessKeyId: 'AKIA3HPWWSDGMD3YKOGQ',
	secretAccessKey: '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',
};

const prod = {
	apiVersion: '2012-11-05',
	region: process.env.REGION || 'sa-east-1',
};

const options = process.env.IS_OFFLINE ? dev : prod;
AWS.config.update(options);
const _sqs = new AWS.SQS();

/**
 * Save new message into queue
 */
const save = async (message, queue = endpoint) => {
	try {
		const url = process.env.IS_OFFLINE ? local : queue;

		const params = {
			QueueUrl: url,
			MessageBody: JSON.stringify(message),
		};

		return await _sqs.sendMessage(params).promise();
	} catch (error) {
		console.log('error --> ', JSON.stringify(error, null, 2));
	}
};
/**
 * Send message to queue
 */
const sendToQueue = async (message, queue = endpoint) => {
	try {
		const url = process.env.IS_OFFLINE ? local : queue;

		const params = {
			QueueUrl: url,
			// MessageGroupId: message.key,
			// MessageDeduplicationId: message.key,
			MessageBody: JSON.stringify(message),
		};
		console.log('SEND TO QUEUE --> ', JSON.stringify(params, null, 2));
		return await _sqs.sendMessage(params).promise();
	} catch (error) {
		console.log('error --> ', JSON.stringify(error, null, 2));
	}
};
/**
 * Get messages from Queue
 */
const consumeQueue = async (numberOfMessages = 1, queue = endpoint) => {
	try {
		const url = process.env.IS_OFFLINE ? local : queue;
		const params = {
			QueueUrl: url,
			MaxNumberOfMessages: numberOfMessages,
		};
		console.log('receiveMessage --> ', JSON.stringify(params, null, 2));
		return await _sqs.receiveMessage(params).promise();
	} catch (error) {
		console.log('error --> ', JSON.stringify(error, null, 2));
	}
};
/**
 * Remove message from quue
 */
const removeFromQueue = (message, queue = endpoint) => {
	const url = process.env.IS_OFFLINE ? local : queue;
	const params = {
		QueueUrl: url,
		ReceiptHandle: message.receiptHandle,
	};
	// console.log('deleteMessage --> ', JSON.stringify(params, null, 2));
	return _sqs.deleteMessage(params).promise();
};

const removeFromQueueSQS = (message, queue = endpoint) => {
	return new Promise((resolve, reject) => {
		const url = process.env.IS_OFFLINE ? local : queue;
		const params = {
			QueueUrl: url,
			ReceiptHandle: message.receiptHandle,
		};
		return _sqs.deleteMessage(params, (err, reply) => {
			if (err) {
				console.log('error deleteMessage --> ', JSON.stringify(err, null, 2));
				return reject(err);
			}
			console.log(
				'data removeFromQueueSQS --> ',
				JSON.stringify(reply, null, 2)
			);
			resolve(reply);
		});
	});
};

const getQueueURL = (queue) => {
	return new Promise((resolve, reject) => {
		const params = {
			QueueName: queue,
		};
		return _sqs.getQueueUrl(params, (err, reply) => {
			if (err) {
				console.log('error getQueueUrl --> ', JSON.stringify(err, null, 2));
				return reject(err);
			}
			console.log('data getQueueUrl --> ', JSON.stringify(reply, null, 2));
			resolve(reply);
		});
	});
};

module.exports = {
	save,
	sendToQueue,
	consumeQueue,
	removeFromQueue,
	removeFromQueueSQS,
	getQueueURL,
};
