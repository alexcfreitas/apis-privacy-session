'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require('../../shared/lib/encryption');

const DYNAMO_TABLE = 'test-privacy-apis-ERD';
/**
 * Register a Organization on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * {
 *   "organization":{
 *      "name":"unimed"
 *   }
 * }
 * After receive a simple payload:
 *
 * Register on DynamoDB Table
 */

const updateOrganization = (event) => {
	const data = event.body ? event.body : event;

	/**@TODO Validate Informations.*/

	const ORG_ID = data.org_id;

	let params = {
		TableName: DYNAMO_TABLE,
		Key: { PK: `ORG#${ORG_ID}`, SK: `#METADATA#${ORG_ID}` },
		UpdateExpression: 'set #org_id = :org_id, updated_at = :updated_at',
		ExpressionAttributeNames: { '#org_id': 'org_id' },
		ExpressionAttributeValues: {
			':org_id': ORG_ID,
			':updated_at': util.getDateFormated(),
		},
	};

	dynamodb.update(params, function (err, data) {
		if (err) {
			console.log(
				'Unable to create item in table. Error JSON:',
				JSON.stringify(err, null, 2)
			);
			console.log('Rejection for newSession:', params);
		} else {
			console.log('ORGANIZATION --> ', JSON.stringify(data, null, 2));
		}
	});
};

(() => {
	updateOrganization({
		org_id: 'a115f8136c2d4fb1944c069d110dc1cc',
		organization: {
			name: 'unimed',
		},
	});
})();
