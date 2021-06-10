'use strict';
const sqs = require('../lib/queue');
const lambda = require('../lib/lambda');

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
const REDIS_LAMBDA = process.env.REDIS_LAMBDA;

let lastIntervalID;

module.exports.run = (event, context, callback) => {
	if (lastIntervalID) {
		clearInterval(lastIntervalID);
	}

	lastIntervalID = setInterval(() => {
		sqs
			.consumeQueue(1, SQS_QUEUE_URL)
			.then((poll) => {
				if (!poll.Messages) {
					return;
				} else {
					poll.Messages.forEach((message) => {
						const item = JSON.parse(message.Body);
						console.log(
							` **************** MsgQueue key ${item.key} Successfully Received **************** `,
							JSON.stringify(item, null, 2)
						);
						_updateRecord(item.key, item.consents)
							.then((success) => {
								console.log(success);
								let data = JSON.parse(success.Payload);
								if (data == null || data.statusCodeProcess == null) {
									console.log(
										` **************** MsgQueue key ${item.key} is NOT Recorded **************** `,
										data
									);
									return data;
								}
								console.log(
									` **************** MsgQueue key ${item.key} Successfully Recorded **************** `,
									JSON.stringify(success, null, 2)
								);
								sqs
									.removeFromQueue(message)
									.then((success) =>
										console.log(
											` **************** MsgQueue key ${item.key} Successfully Removed **************** `,
											JSON.stringify(success, null, 2),
											JSON.stringify(message, null, 2)
										)
									)
									.catch((err) => console.log(err));
							})
							.catch((err) => console.log(err));
					});
				}
			})
			.catch((err) => console.log(err));
	}, 100);
};

const _updateRecord = (key, consents) => {
	return lambda.invoke(REDIS_LAMBDA, {
		method: 'SET',
		key: key,
		consents: consents,
	});
};
