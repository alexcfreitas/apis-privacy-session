'use strict';
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
// const DYNAMO_TABLE = "test-privacy-apis-ERD";

/**
 * Session CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register Session on DynamoDB
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

		const ORG_ID = data.org_id;
		const SESSION_ID = getId();

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${ORG_ID}`,
				SK: `SESS#${SESSION_ID}`,
				org_id: ORG_ID,
				session_id: SESSION_ID,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		let sessData = await dynamodb.save(params);

		return {
			org_id: sessData.Item.org_id,
			session_id: sessData.Item.session_id,
			spvll: sessData.Item.spvll,
		};
	} catch (error) {
		throw new Error('Session not recorded try again');
	}
};

module.exports = {
	create,
	// get,
	// find,
	// update,
	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
