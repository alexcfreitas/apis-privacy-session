const { Organization, Asset, Identifier } = require('common').Service;
const response = require('common').Response;
const util = require('common').Util;

/** Enable Organizer, Asset and Identifiers  
{
  "organization": {
    "organizationId": 0000000000,
    "assets": [
      {
        "assetId": 0000000
        "url": "www.x.com.br",
        "isActive": true,
        "isDeleted": true
      }
    ]
  }
}
*/

module.exports.run = async (event, context, callback) => {
	try {
		const body = event.body ? event.body : event;
		const data = JSON.parse(body);

		const { organization } = data;

		const {
			organizationId,
			isActive,
			isDeleted,
			assets,
			identifiers,
		} = organization;

		const assetApiKeys = [];
		const identifiersUpdated = [];

		const org_data = await Organization.update({
			org_id: organizationId,
			is_active: isActive,
			is_deleted: isDeleted,
		});

		if (assets.length > 0) {
			for await (let asset of assets) {
				const { assetId, url, isActive, isDeleted } = asset;

				const assetData = await Asset.update({
					org_id: organizationId,
					asset_id: assetId,
					url: url ? url : '',
					is_active: isActive,
					is_deleted: isDeleted,
				});
				assetApiKeys.push(assetData);
			}
		}

		if (identifiers.length > 0) {
			for await (let iden of identifiers) {
				const { identifierId, key, isActive, isDeleted } = iden;

				const identifierData = await Identifier.update({
					org_id: organizationId,
					identifier_id: identifierId,
					identifier_key: key,
					is_active: isActive,
					is_deleted: isDeleted,
				});
				identifiersUpdated.push(identifierData);
			}
		}

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message:
						'Organizations, Assets, Identifiers, ConsentGroups and ConsentTypes successfully updated',
					organization: {
						org_id: organizationId,
						assets: assetApiKeys,
						identifiers: identifiersUpdated,
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
