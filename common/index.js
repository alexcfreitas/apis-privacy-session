'use strict';
module.exports.Auth = require('./lib/auth');
module.exports.Dynamo = require('./lib/dynamo');
module.exports.Queue = require('./lib/sqs');
module.exports.Encryption = require('./lib/encryption');
module.exports.Response = require('./lib/response');
module.exports.Util = require('./lib/util');

module.exports.Service = {
	Asset: require('./services/asset.service'),
	Identifier: require('./services/identifier.service'),
	Organization: require('./services/organization.service'),
	Person: require('./services/person.service'),
	Session: require('./services/session.service'),
	Consent: require('./services/consent.service'),
	PersonIdentifier: require('./services/person-identifier.service'),
	PersonConsent: require('./services/person-consent.service'),
	PersonSession: require('./services/person-session.service'),
};
