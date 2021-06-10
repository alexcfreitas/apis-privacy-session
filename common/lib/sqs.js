'use strict';

const AWS = require('aws-sdk');

const endpoint = process.env.SQS_QUEUE_URL;
// const endpoint =
// 	'https://sqs.sa-east-1.amazonaws.com/772000878796/sqs-consent-management-cache-prod';

const options = {
	apiVersion: '2012-11-05',
	region: process.env.REGION || 'sa-east-1',
	// accessKeyId: 'AKIA3HPWWSDGMD3YKOGQ',
	// secretAccessKey: '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',
};

const _sqs = new AWS.SQS(options);

/**
 * Save new message into queue
 */
const save = async (message, queue = endpoint) => {
	const url = queue;

	const params = {
		QueueUrl: url,
		MessageBody: JSON.stringify(message),
	};

	return await _sqs.sendMessage(params).promise();
};
/**
 * Send message to queue
 */
const sendToQueue = async (message, queue = endpoint) => {
	const url = queue;

	const params = {
		QueueUrl: url,
		// MessageGroupId: message.key,
		// MessageDeduplicationId: message.key,
		MessageBody: JSON.stringify(message),
	};
	console.log('SEND TO QUEUE --> ', JSON.stringify(params, null, 2));
	return await _sqs.sendMessage(params).promise();
};
/**
 * Get messages from Queue
 */
const consumeQueue = async (numberOfMessages = 1, queue = endpoint) => {
	const url = queue;
	const params = {
		QueueUrl: url,
		MaxNumberOfMessages: numberOfMessages,
		VisibilityTimeout: 10,
		WaitTimeSeconds: 10,
	};
	console.log('receiveMessage --> ', JSON.stringify(params, null, 2));
	return await _sqs.receiveMessage(params).promise();
};
/**
 * Remove message from quue
 */
const removeFromQueue = async (message, queue = endpoint) => {
	try {
		if (message !== false && message !== undefined) {
			const url = queue;
			const params = {
				QueueUrl: url,
				ReceiptHandle: message.ReceiptHandle,
			};
			console.log('deleteMessage --> ', JSON.stringify(params, null, 2));

			return await _sqs.deleteMessage(params).promise();
		}
	} catch (error) {
		console.log('deleteMessage --> ', JSON.stringify(error, null, 2));
	}
};

module.exports = {
	save,
	sendToQueue,
	consumeQueue,
	removeFromQueue,
};
