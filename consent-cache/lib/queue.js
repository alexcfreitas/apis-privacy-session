'use strict';

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const endpoint = process.env.SQS_QUEUE_URL;

const local =
	'https://sqs.sa-east-1.amazonaws.com/772000878796/sqs-consent-management-cache-prod';

const dev = {
	apiVersion: '2012-11-05',
	region: process.env.REGION || 'sa-east-1',
	endpoint: 'https://sqs.amazonaws.com',
	sslEnabled: false,
	accessKeyId: 'AKIA3HPWWSDGMD3YKOGQ',
	secretAccessKey: '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',
};

const prod = {
	apiVersion: '2012-11-05',
	region: process.env.REGION || 'sa-east-1',
	// endpoint: 'https://sqs.amazonaws.com',
};

const options = process.env.IS_OFFLINE ? dev : prod;
AWS.config.update(options);
const _sqs = new AWS.SQS();

const client = {
	/**
	 * Save new message into queue
	 */
	save: (message, queue = endpoint) => {
		const url = process.env.IS_OFFLINE ? local : queue;

		const params = {
			QueueUrl: url,
			MessageBody: JSON.stringify(message),
		};

		return _sqs.sendMessage(params).promise();
	},
	/**
	 * Send message to queue
	 */
	sendToQueue: (message, queue = endpoint) => {
		const url = process.env.IS_OFFLINE ? local : queue;

		const params = {
			QueueUrl: url,
			MessageBody: JSON.stringify(message),
		};

		return _sqs.sendMessage(params).promise();
	},
	/**
	 * Get messages from Queue
	 */
	consumeQueue: (numberOfMessages = 1, queue = endpoint) => {
		const url = process.env.IS_OFFLINE ? local : queue;
		const params = {
			QueueUrl: url,
			MaxNumberOfMessages: numberOfMessages,
		};
		return _sqs.receiveMessage(params).promise();
	},
	/**
	 * Remove message from quue
	 */
	removeFromQueue: (message, queue = endpoint) => {
		if (message !== false && message !== undefined) {
			const url = process.env.IS_OFFLINE ? local : queue;

			const params = {
				QueueUrl: url,
				ReceiptHandle: message.ReceiptHandle,
			};

			return _sqs.deleteMessage(params).promise();
		}
	},
};

module.exports = client;
