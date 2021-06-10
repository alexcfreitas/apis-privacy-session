const encryption = require('common').Encryption;
const {
	PersonSession,
	PersonIdentifier,
	PersonConsent,
} = require('common').Service;

(async () => {
	const personSession = await PersonSession.findBySPVLL(
		'15BF532D22345576B4A51B96DA4754C039EF3458494066D76828E893D69EBD1E'
	);
	console.log('personSession --> ', JSON.stringify(personSession, null, 2));
})();
