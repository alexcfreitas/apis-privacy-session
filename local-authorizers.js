const { Asset } = require('common').Service;
const auth = require('common').Auth;

const authorizeAsset = (asset, methodArn) => {
	// TODO: Validate Bussines Rules in Assets
	// return !asset.isBlocked;
	if (!asset.is_active) return false;
	return true;
};

module.exports.authorizer = async (event, context, callback) => {
	try {
		const asset = await Asset.findAssetByApiKey({
			api_key: event.headers['x-api-key'],
		});

		const isAllowed =
			Object.keys(asset).length > 0
				? authorizeAsset(asset, event.methodArn)
				: false;
		const effect = isAllowed ? 'Allow' : 'Deny';
		const authorizerContext = { asset: JSON.stringify(asset) };
		const policyDocument = auth.buildIAMPolicy(
			event.headers['x-api-key'],
			effect,
			event.methodArn,
			authorizerContext
		);

		callback(null, policyDocument);
	} catch (err) {
		callback('Unauthorized'); // Return a 401 Unauthorized response
	}
};
