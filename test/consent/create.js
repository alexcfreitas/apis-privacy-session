'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require('../../shared/lib/encryption');

const DYNAMO_TABLE = 'test-privacy-apis-ERD';
/**
 * Register a Consent on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *  org_id: "a115f8136c2d4fb1944c069d110dc1cc",
 *  is_accept: true or false,
 *  consent_data: {},
 * }
 * After receive a simple payload:
 * Register on DynamoDB Table
 */
const createConsent = (event) => {
	const data = event.body ? event.body : event;

	/**@TODO Validate Informations.*/

	const ORG_ID = data.org_id;
	const CONSENT_ID = getId();

	let params = {
		TableName: DYNAMO_TABLE,
		Item: {
			PK: `ORG#${ORG_ID}`,
			SK: `CONS#${CONSENT_ID}`,
			consent_id: CONSENT_ID,
			is_accept: data.is_accept,
			consent_data: data.consent_data,
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
			console.log('CONSENT --> ', JSON.stringify(data, null, 2));
		}
	});
};

(() => {
	createConsent({
		org_id: 'a115f8136c2d4fb1944c069d110dc1cc',
		is_accept: true,
		consent_data: {
			id: 1,
			first_name: 'Jilleen',
			last_name: 'Snewin',
			email_address: 'jsnewin0@army.mil',
			gender: 'Female',
			ip_address: '156.222.65.65',
			credit_card: '3586521070027900',
			city: 'Cartago',
			email: 'jsnewin0@indiatimes.com',
			avatar: 'https://robohash.org/cumqueofficiaearum.jpg?size=50x50&set=set1',
			corporate: 'Sales',
			EIN: '95-5883229',
			latitude: 4.7472212,
			product: 'Dragon Fruit',
			user_agent:
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.124 Safari/537.36',
			university: "Institut Catholique d'Arts et Métiers Lille",
		},
	});
})();

/**
 * Exemple Possible Persons ID
 *  -> Alex -> e05e78e1c80d46b488f3026f91c7a9df
 *  -> Francisco -> b2206803d63e434190ebc4f650d2aa18
 *  -> Joao -> 726f61049d1d4a89979821fbfd04f8e9
 *  -> Juliana -> 6adbfec746dc410a9bb29c3e31c5d25f
 */
