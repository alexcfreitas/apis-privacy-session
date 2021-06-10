'use strict';

const redis = require('../lib/redis');
const sqs = require('../lib/queue');

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL || 'book';

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
								console.log(
									` **************** MsgQueue key ${success.key} Successfully Recorded **************** `,
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
	return redis.set(key, JSON.stringify(consents));
};
