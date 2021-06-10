'use strict';
const dynamodb = require('../../shared/lib/dynamo');
const { getId, getApiKey } = require('../../shared/lib/encryption');
const util = require('../lib/util');
const DYNAMO_TABLE = 'test-privacy-apis-ERD';
/**
 * Register a Asset on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * See MOCK DUMMY DATA below
 * After receive a simple payload:
 * Register on DynamoDB Table
 */
const createAsset = async (event) => {
	const data = event.body ? event.body : event;

	/**@TODO Validate Informations.*/

	const ORG_ID = data.org_id;
	const ASSET_ID = getId();
	const API_KEY = getApiKey();

	let params = {
		TableName: DYNAMO_TABLE,
		Item: {
			PK: `ORG#${ORG_ID}`,
			SK: `ASSE#${ASSET_ID}`,
			asset_id: ASSET_ID,
			name: data.asset.name,
			api_key: API_KEY,
			data: `ASSE#${API_KEY}`,
			origin: data.asset.origin,
			created_at: util.getDateFormated(),
		},
	};

	return await dynamodb.save(params);
};

(async () => {
	const assetCreated = await createAsset({
		org_id: 'a115f8136c2d4fb1944c069d110dc1cc',
		name: 'unimed_platform_portal',
		origin: 'portalbeneficiario.com.br',
	});

	console.log('ASSET --> ', JSON.stringify(assetCreated, null, 2));
})();
