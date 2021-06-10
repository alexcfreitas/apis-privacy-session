'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require('../../shared/lib/encryption');

const DYNAMO_TABLE = 'test-privacy-apis-ERD';
/**
 * Register a Person on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *   "org_id": "88242366-eff5-47e8-a732-b350704da6b7",
 *   "person":{
 *      "name":"xxxx xxxxx xxx"
 *   }
 * }
 * After receive a simple payload:
 * Register on DynamoDB Table
 */
const createPerson = (event) => {
	const data = event.body ? event.body : event;

	/**@TODO Validate Informations.*/

	const ORG_ID = data.org_id;
	const PERSON_ID = getId();

	let params = {
		TableName: DYNAMO_TABLE,
		Item: {
			PK: `ORG#${ORG_ID}`,
			SK: `PERS#${PERSON_ID}`,
			person_id: PERSON_ID,
			name: data.person.name,
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
			console.log('PERSON --> ', JSON.stringify(data, null, 2));
		}
	});
};

(() => {
	createPerson({
		org_id: 'a115f8136c2d4fb1944c069d110dc1cc',
		person: {
			name: 'Joao',
		},
	});
})();
