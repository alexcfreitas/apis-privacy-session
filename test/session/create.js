'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require('../../shared/lib/encryption');

const DYNAMO_TABLE = 'test-privacy-apis-ERD';
/**
 * Register a Session on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *   "org_id": "88242366-eff5-47e8-a732-b350704da6b7",
 *   "spvll" : "814783e4826c13695dffa604a45ba95f2cd988ba9a5d08f302569eacec79dc3ad2f01a0d998966d8708ac0912e6d50c5810eb4d15f65261bfc13ae48d0000000d969e7ed9ace902339ba64b6b62dcd5a1NZ2dPmxfC9KerKyBee9rwtmB5p4i2VAp9"
 * }
 * After receive a simple payload:
 * Register on DynamoDB Table
 */
const createSession = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/
		const ORG_ID = data.org_id;
		const SESSION_ID = getId();

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${ORG_ID}`,
				SK: `SESS#${SESSION_ID}`,
				session_id: SESSION_ID,
				spvll: data.spvll,
				created_at: util.getDateFormated(),
			},
		};

		const session = dynamodb.put(params).promise();

		return params;
	} catch (error) {
		console.log(
			'Unable to create item in table. Error JSON:',
			JSON.stringify(error, null, 2)
		);
		console.log('Rejection for SESSION:', params);
	}
};

(async () => {
	const sessionCreated = await createSession({
		org_id: 'a115f8136c2d4fb1944c069d110dc1cc',
		spvll:
			'814783e4826c13695dffa604a45ba95f2cd988ba9a5d08f302569eacec79dc3ad2f01a0d998966d8708ac0912e6d50c5810eb4d15f65261bfc13ae48d0000000d969e7ed9ace902339ba64b6b62dcd5a1NZ2dPmxfC9KerKyBee9rwtmB5p4i2VAp9',
	});

	console.log('SESSION --> ', JSON.stringify(sessionCreated, null, 2));
})();
