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
		/**@TODO Validate Informations.*/

		const { org_id, is_active, is_deleted } = data;
		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${org_id}`,
				SK: `#METADATA#${org_id}`,
				org_id,
				is_active,
				is_deleted,
				data_key: `ORG#${org_id}`,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		const orgData = await dynamodb.save(params);

		return { ...orgData.Item };
	} catch (error) {
		throw new Error('Organization not recorded try again');
	}
};

const get = async (event) => {
	try {
		const data = event.body ? event.body : event;
		/**@TODO Validate Informations.*/

		let ORG_ID = data.org_id;

		let params = {
			TableName: DYNAMO_TABLE,
			Key: { PK: `ORG#${ORG_ID}`, SK: `#METADATA#${ORG_ID}` },
		};

		const orgData = await dynamodb.find(params);

		return orgData.Item
			? {
					...orgData.Item,
			  }
			: {};
	} catch (error) {
		throw new Error('Organization not enabled try again');
	}
};

const update = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/

		const { org_id, is_active, is_deleted } = data;

		const expression = util.generateUpdateQuery({
			org_id,
			is_active,
			is_deleted,
			data_key: `ORG#${org_id}`,
			updated_at: util.getDateFormated(),
		});

		let params = {
			TableName: DYNAMO_TABLE,
			Key: { PK: `ORG#${org_id}`, SK: `#METADATA#${org_id}` },
			...expression,
			ReturnValues: 'ALL_NEW',
		};

		const organizationData = await dynamodb.update(params);
		return { ...organizationData.Attributes };
	} catch (error) {
		throw new Error('Organization not updated try again');
	}
};

module.exports = {
	create,
	get,
	// find,
	update,
	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
