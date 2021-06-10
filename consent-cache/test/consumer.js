const { get, set } = require('../lib/redis');
const sqs = require('../lib/sqs');

module.exports.run = async (event, context, callback) => {
	try {
		const poll = event.Records;
		console.log('Poll --> ', JSON.stringify(poll, null, 2));
		if (!poll) {
			return await callback(null, 'Successfully');
		} else {
			for await (let message of poll) {
				const { key, consents } = JSON.parse(message.body);
				let isExistsMsg = await get(key);
				if (!isExistsMsg) {
					let sendMsg = await set(key, JSON.stringify(consents));
					console.log(
						'Consents Successfully Recorded --> ',
						JSON.stringify(sendMsg, null, 2)
					);
				}
				let removeMsg = await sqs.removeFromQueueSQS(message);
				console.log(
					'MessageQueue Successfully Removed --> ',
					JSON.stringify(removeMsg, null, 2)
				);
				return await callback(null, 'Successfully');
				// return await context.succeed();
			}
		}
	} catch (error) {
		console.log('error --> ', JSON.stringify(error, null, 2));
	}
};
