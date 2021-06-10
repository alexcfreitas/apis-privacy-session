'use strict';
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
// const DYNAMO_TABLE = "test-privacy-apis-ERD";

/**
 * Organization CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register Organization on DynamoDB
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

		const {
			org_id,
			identifier_id,
			identifier_key,
			is_active,
			is_deleted,
		} = data;

		let identifierData = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${org_id}`,
				SK: `IDEN#${identifier_id}`,
				org_id,
				identifier_id,
				identifier_key,
				is_active,
				is_deleted,
				data_key: `IDEN#${identifier_key}`,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		let idenData = await dynamodb.save(identifierData);

		return { ...idenData.Item };
	} catch (error) {
		throw new Error('Identifier not recorded try again');
	}
};

const update = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/

		const {
			org_id,
			identifier_id,
			identifier_key,
			is_active,
			is_deleted,
		} = data;
		const expression = util.generateUpdateQuery({
			org_id,
			identifier_id,
			identifier_key,
			is_active,
			is_deleted,
			data_key: `IDEN#${identifier_key}`,
			updated_at: util.getDateFormated(),
		});

		let params = {
			TableName: DYNAMO_TABLE,
			Key: { PK: `ORG#${org_id}`, SK: `IDEN#${identifier_id}` },
			...expression,
			ReturnValues: 'ALL_NEW',
		};

		const idenData = await dynamodb.update(params);
		return { ...idenData.Attributes };
	} catch (error) {
		throw new Error('Identifier not updated try again');
	}
};

const findIdentifierByKey = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/
		const ORG_ID = data.org_id;
		const IDENTIFIER_KEY = data.identifier_key;

		let params = {
			TableName: DYNAMO_TABLE,
			IndexName: 'PK-data_key-Filter',
			KeyConditionExpression: '#PK = :PK and begins_with(#SK, :SK)',
			ExpressionAttributeNames: { '#PK': 'PK', '#SK': 'data_key' },
			ExpressionAttributeValues: {
				':PK': `ORG#${ORG_ID}`,
				':SK': `IDEN#${IDENTIFIER_KEY}`,
			},
		};

		const identifierData = await dynamodb.list(params);
		return { ...identifierData.Items[0] };
	} catch (error) {
		throw new Error('Identifier not founded try again');
	}
};

module.exports = {
	create,
	findIdentifierByKey,
	// get,
	// find,
	update,
	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
