const { Organization, Identifier, Asset } = require('common').Service;
const response = require('common').Response;

/** Enable Organizer, Asset and Identifiers  
{
  "organization": {
    "organizationId": 0000000000,
    "isActive": true,
    "isDeleted": true,
    "assets": [
      {
        "assetId": 0000000,
        "url": "www.x.com.br",
        "isActive": true,
        "isDeleted": true
      },
      {
        "assetId": 0000000,
        "url": "www.x.com.br",
        "isActive": true,
        "isDeleted": true
      }
    ],
    "identifiers": [
      {
        "identifierId": 00000,
        "key": "cbenef",
        "isActive": true,
        "isDeleted": false
      },
      {
        "identifierId": 00000,
        "key": "cbenef",
        "isActive": true,
        "isDeleted": false
      }
    ]
  }
}
*/

module.exports.run = async (event, context, callback) => {
	try {
		const body = event.body ? event.body : event;
		const data = JSON.parse(body);
		const responseData = [];
		const { organization } = data;

		const {
			organizationId,
			isActive,
			isDeleted,
			assets,
			identifiers,
		} = organization;

		const org_enabled = await Organization.get({
			org_id: organizationId,
		});

		if (Object.keys(org_enabled).length > 0) {
			return response.json(
				callback,
				{
					result: {
						code: 4001,
						message: `this organization has already been enabled`,
					},
				},
				400
			);
		}

		const org_data = await Organization.create({
			org_id: organizationId,
			is_active: isActive,
			is_deleted: isDeleted,
		});

		const assetApiKeys = [];
		const identifiersCreated = [];

		if (assets.length > 0) {
			for await (let asset of assets) {
				const { assetId, url, isActive, isDeleted } = asset;
				const assetData = await Asset.create({
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
			for await (let identifier of identifiers) {
				const { identifierId, key, isActive, isDeleted } = identifier;
				const identifierData = await Identifier.create({
					org_id: organizationId,
					identifier_id: identifierId,
					identifier_key: key,
					is_active: isActive,
					is_deleted: isDeleted,
				});
				identifiersCreated.push(identifierData);
			}
		}

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'Organizations, Assets and Identifiers successfully enabled',
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
		console.log('error --> ', JSON.stringify(error, null, 2));
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
