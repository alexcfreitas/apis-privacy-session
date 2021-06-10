const { set } = require('../lib/redis');
const sqs = require('../lib/sqs');

module.exports.run = (event, context, callback) => {
	try {
		const poll = event.Records;
		console.log('Poll --> ', JSON.stringify(poll, null, 2));
		if (!poll) {
			return callback(null);
		} else {
			poll.forEach((message) => {
				const { key, consents } = JSON.parse(message.body);
				set(key, JSON.stringify(consents))
					.then((success) => {
						console.log(
							'removeFromQueue --> ',
							JSON.stringify(success, null, 2)
						);
						return sqs
							.removeFromQueue(message)
							.then((msgRemoved) => {
								console.log(
									'msgRemoved --> ',
									JSON.stringify(msgRemoved, null, 2)
								);
								return callback(null, msgRemoved);
							})
							.catch((errRemoveQueue) =>
								console.error(
									'error deleteMessage --> ',
									JSON.stringify(errRemoveQueue, null, 2)
								)
							);
					})
					.catch((err) => console.log(err));
			});
		}
	} catch (error) {
		console.error('error --> ', JSON.stringify(error, null, 2));
		return callback(error);
	}
};
