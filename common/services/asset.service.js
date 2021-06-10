'use strict';
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');
const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
// const DYNAMO_TABLE = "table-consent-management-dev";

/**
 * Asset CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register Asset on DynamoDB
 * @TODO @get() -
 * @TODO @find() -
 * @TODO @update() -
 * @TODO @listAssetsById() -
 * @TODO @listIdentifiersById() -
 * @TODO @listPersonsById() -
 */

const create = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/

		let API_KEY = getApiKey();
		const { org_id, asset_id, url, is_active, is_deleted } = data;

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${org_id}`,
				SK: `ASSE#${asset_id}`,
				org_id,
				asset_id,
				url,
				is_active,
				is_deleted,
				api_key: API_KEY,
				data_key: `ASSE#${API_KEY}`,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};

		const assetData = await dynamodb.save(params);

		return {
			...assetData.Item,
		};
	} catch (error) {
		throw new Error('Asset not recorded try again');
	}
};

const update = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/

		const { org_id, asset_id, url, is_active, is_deleted } = data;

		const expression = util.generateUpdateQuery({
			org_id,
			asset_id,
			url,
			is_active,
			is_deleted,
			updated_at: util.getDateFormated(),
		});

		let params = {
			TableName: DYNAMO_TABLE,
			Key: { PK: `ORG#${org_id}`, SK: `ASSE#${asset_id}` },
			...expression,
			ReturnValues: 'ALL_NEW',
		};

		const assetData = await dynamodb.update(params);
		return { ...assetData.Attributes };
	} catch (error) {
		throw new Error('Asset not updated try again');
	}
};

const findAssetByApiKey = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/

		const API_KEY = data.api_key;

		let params = {
			TableName: DYNAMO_TABLE,
			IndexName: 'data_key-filter',
			KeyConditionExpression: '#data_key = :data_key',
			ExpressionAttributeNames: { '#data_key': 'data_key' },
			ExpressionAttributeValues: {
				':data_key': `ASSE#${API_KEY}`,
			},
		};

		const assetData = await dynamodb.list(params);
		return { ...assetData.Items[0] };
	} catch (error) {
		console.log(error);
		throw new Error('Asset not founded try again');
	}
};

module.exports = {
	create,
	update,
	findAssetByApiKey,
	// get,
	// find,
	// update,
	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
