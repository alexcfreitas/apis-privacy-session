'use strict';
const {
	Session,
	Identifier,
	Person,
	PersonIdentifier,
	PersonSession,
} = require('common').Service;

const response = require('common').Response;
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
module.exports.run = async (event, context, callback) => {
	try {
		const body = event.body ? event.body : event;
		const asset = JSON.parse(event.requestContext.authorizer.asset);
		const data = JSON.parse(body);

		const personSession = await PersonSession.findPersonSessionBySPVLL({
			org_id: asset.org_id,
			spvll: data.spvll,
		});

		if (Object.keys(personSession).length === 0) {
			return response.json(
				callback,
				{
					result: {
						code: 4001,
						message: `session had not started`,
					},
				},
				400
			);
		}

		// Update Person-Session
		const person_session = await PersonSession.update({
			PK: personSession.PK,
			SK: personSession.SK,
			is_active: false,
		});

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'session successfully ended',
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
					message: 'session not ended try again',
					error,
				},
			},
			500
		);
	}
};
