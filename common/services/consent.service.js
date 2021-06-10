'use strict';
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');
const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * Consent CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register Consent on DynamoDB
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
		// const data = JSON.parse(body);
		/**@TODO Validate Informations.*/

		const ORG_ID = data.org_id;
		const PERS_ID = data.person_id;
		const CONSENT_ID = getId();

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${ORG_ID}`,
				SK: `CONS#${CONSENT_ID}`,
				org_id: ORG_ID,
				consent_id: CONSENT_ID,
				person_id: data.person_id,
				data_key: `CONS#${PERS_ID}`,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		const consData = await dynamodb.save(params);

		return {
			org_id: consData.Item.org_id,
			consent_id: consData.Item.consent_id,
			person_id: consData.Item.person_id,
		};
	} catch (error) {
		throw new Error('Consent not recorded try again');
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
