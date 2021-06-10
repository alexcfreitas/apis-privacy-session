'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require('../../shared/lib/encryption');

const DYNAMO_TABLE = 'test-privacy-apis-ERD';
/**
 * Register a Identifier on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *   "org_id": "88242366-eff5-47e8-a732-b350704da6b7",
 *   "identifier_key":"carteirinha"
 * }
 * After receive a simple payload:
 *
 * Register on DynamoDB Table
 */
const createIdentifier = (event) => {
	const data = event.body ? event.body : event;

	/**@TODO Validate Informations.*/

	const ORG_ID = data.org_id;
	const IDENTIFIER_ID = getId();

	let params = {
		TableName: DYNAMO_TABLE,
		Item: {
			PK: `ORG#${ORG_ID}`,
			SK: `IDEN#${IDENTIFIER_ID}`,
			identifier_id: IDENTIFIER_ID,
			key: data.identifier.key,
			created_at: util.getDateFormated(),
		},
	};

	dynamodb.put(params, function (err, data) {
		if (err) {
			console.log(
				'Unable to create item in table. Error JSON:',
				JSON.stringify(err, null, 2)
			);
			console.log('Rejection for newSession:', params);
		} else {
			console.log('IDENTIFIER --> ', JSON.stringify(data, null, 2));
		}
	});
};

(() => {
	createIdentifier({
		org_id: 'a115f8136c2d4fb1944c069d110dc1cc',
		identifier: {
			key: 'ra',
		},
	});
})();
