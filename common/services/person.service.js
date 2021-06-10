'use strict';
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');
const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * Person CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register Person on util
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
		const PERSON_ID = getId();

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${ORG_ID}`,
				SK: `PERS#${PERSON_ID}`,
				org_id: ORG_ID,
				person_id: PERSON_ID,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		const persData = await dynamodb.save(params);

		return {
			org_id: persData.Item.org_id,
			person_id: persData.Item.person_id,
		};
	} catch (error) {
		throw new Error('Person not recorded try again');
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
