'use strict';
const {
	Session,
	Identifier,
	Person,
	PersonIdentifier,
	PersonSession,
	Asset,
} = require('common').Service;
const util = require('common').Util;
const response = require('common').Response;
const Paylod = require('./eventUpdateOrganization.json');
/**
 * Register a single Session on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 *
 * {
 *   "spvll": "4f6d4f65d4f65ds465f4ds",
 *   "identifier":{
 *      "key":" ",
 *      "value":"54654564645"
 *   }
 * }
 *
 * After receibe a simple payload:
 * Register on DynamoDB Table
 */
const run = async (event, context, callback) => {
	try {
		const data = event.body ? event.body : event;
		const asset = event.requestContext.authorizer.asset;
		// const data = JSON.parse(body);
		const { organizationId, assets, identifiers } = data.organization;
		const identifiersCreated = [];
		const assetApiKeys = [];

		if (assets.length > 0) {
			for await (let asset of assets) {
				const { identifierId, url, isActive, isDeleted } = asset;

				let isValidObject = {
					url: url,
					is_active: isActive,
					is_deleted: isDeleted,
					updated_at: util.getDateFormated(),
				};

				let obj = util.getAtributesValid(
					isValidObject,
					'url',
					'is_active',
					'is_deleted',
					'data_key',
					'updated_at'
				);

				const assetData = await Asset.update({
					PK: `ORG#${organizationId}`,
					SK: `ASSE#${asset.assetId}`,
					org_id: organizationId,
					asset_id: asset.assetId,
					url: asset.url,
					is_active: asset.isActive,
					is_deleted: asset.isDeleted,
					updated_at: util.getDateFormated(),
				});
				assetApiKeys.push(assetData);
			}
		}

		if (identifiers.length > 0) {
			for await (let iden of identifiers) {
				const { identifierId, key, isActive, isDeleted } = iden;

				let isValidObject = {
					identifier_key: key,
					is_active: isActive,
					is_deleted: isDeleted,
					data_key: `IDEN#${key}`,
					updated_at: util.getDateFormated(),
				};

				let obj = util.getAtributesValid(
					isValidObject,
					'identifier_id',
					'identifier_key',
					'is_active',
					'is_deleted',
					'data_key',
					'updated_at'
				);

				const identifierData = await Identifier.update({
					PK: `ORG#${organizationId}`,
					SK: `IDEN#${identifierId}`,
					object: obj,
				});
				identifiersCreated.push(identifierData);
			}
		}

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'Organizations, Assets and Identifiers successfully updated',
					organization: {
						org_id: organizationId,
						assets: assetApiKeys,
						identifiers: identifiersCreated,
					},
				},
			},
			200
		);
	} catch (error) {
		return response.json(
			callback,
			{
				result: {
					code: 5001,
					message: error.message
						? error.message
						: 'Organizations, Assets and Identifiers not recorded try again ',
					error,
				},
			},
			500
		);
	}
};

const callback = (erro, data) => {
	console.info('*******************');
	console.info(
		'Erro: ',
		erro === null ? 'Não há erros' : JSON.stringify(erro, null, 2)
	);
	console.info('*******************');
	console.info('Sucesso: ', JSON.stringify(data, null, 2));
	console.info('*******************');
};

(async () => {
	let test = run(Paylod, {}, callback);

	console.log('RESULT --> ', JSON.stringify(test, null, 2));
})();
