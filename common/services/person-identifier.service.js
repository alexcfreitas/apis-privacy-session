'use strict';
const { getId, getApiKey } = require('../lib/encryption');
const dynamodb = require('../lib/dynamo');
const util = require('../lib/util');

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;

/**
 * PersonIdentifier CRUD Abstraction
 * @Author: Alexsandro Carvalho de Freitas
 *
 * @create() - Register PersonIdentifier on DynamoDB
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
		const PERSON_ID = data.person_id;
		const IDENTIFIER_ID = data.identifier_id;
		const PERSON_IDENTIFIER_ID = getId();
		const PERSON_IDENTIFIER_VALUE = data.person_identifier_value;

		let params = {
			TableName: DYNAMO_TABLE,
			Item: {
				PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
				SK: `ORG#${ORG_ID}#IDEN#${IDENTIFIER_ID}`,
				org_id: ORG_ID,
				person_id: PERSON_ID,
				person_identifier_id: PERSON_IDENTIFIER_ID,
				person_identifier_key: data.person_identifier_key,
				person_identifier_value: data.person_identifier_value,
				data_key: `ORG#${ORG_ID}#PERS#IDEN#${PERSON_IDENTIFIER_VALUE}`,
				created_at: util.getDateFormated(),
				updated_at: util.getDateFormated(),
			},
		};
		const persIdenData = await dynamodb.save(params);

		return {
			org_id: persIdenData.Item.org_id,
			person_id: persIdenData.Item.person_id,
			person_identifier_id: persIdenData.Item.person_identifier_id,
			person_identifier_key: persIdenData.Item.person_identifier_key,
			person_identifier_value: persIdenData.Item.person_identifier_value,
		};
	} catch (error) {
		throw new Error('PersonIdentifier not recorded try again');
	}
};

const findPersonIdentifierByIdenValue = async (event) => {
	try {
		const data = event.body ? event.body : event;

		/**@TODO Validate Informations.*/
		const ORG_ID = data.org_id;
		const PERSON_IDENTIFIER_VALUE = data.person_identifier_value;

		let params = {
			TableName: DYNAMO_TABLE,
			IndexName: 'data_key-filter',
			KeyConditionExpression: '#data_key = :data_key',
			ExpressionAttributeNames: { '#data_key': 'data_key' },
			ExpressionAttributeValues: {
				':data_key': `ORG#${ORG_ID}#PERS#IDEN#${PERSON_IDENTIFIER_VALUE}`,
			},
		};

		const personIdentifierData = await dynamodb.list(params);
		return { ...personIdentifierData.Items[0] };
	} catch (error) {
		console.info(
			'Erro: ',
			error === null ? 'Não há erros' : JSON.stringify(error, null, 2)
		);
		throw new Error('Asset not founded try again');
	}
};

module.exports = {
	create,
	findPersonIdentifierByIdenValue,
	// get,
	// find,
	// update,
	// listAssetsById,
	// listIdentifiersById,
	// listPersonsById
};
