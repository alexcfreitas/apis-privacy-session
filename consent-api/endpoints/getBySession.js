'use strict';
const {
	PersonSession,
	PersonIdentifier,
	PersonConsent,
} = require('common').Service;

const response = require('common').Response;
/**
 * Register a single Session on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * {
 *   "spvll": "xxxxx"
 * }
 * After receibe a simple payload:
 * Register on DynamoDB Table
 */
module.exports.run = async (event, context, callback) => {
	try {
		const body = event.body ? event.body : event;
		const data = JSON.parse(body);
		// const asset = { org_id: '233455000989' }; //RemoveBeforeDeploy

		const { spvll } = data;
		const { org_id } = await PersonSession.findBySPVLL(spvll);

		const personSession = await PersonSession.findPersonSessionBySPVLL({
			org_id,
			spvll,
		});

		if (Object.keys(personSession).length === 0) {
			return response.json(
				callback,
				{
					result: {
						code: 4001,
						message: `session not started, access /session/start to register your session`,
					},
				},
				400
			);
		}

		if (personSession.is_active === false) {
			return response.json(
				callback,
				{
					result: {
						code: 4001,
						message: `session not started, access /session/start to register your session`,
					},
				},
				400
			);
		}

		//getAllConsentsByPersonId
		const consents = await PersonConsent.findPersonConsentByIdentifierValue({
			org_id,
			person_identifier_value: personSession.person_identifier_value,
		});

		if (consents.length === 0) {
			return response.json(
				callback,
				{
					result: {
						code: 4041,
						message: 'Consents not founded, try again',
					},
				},
				404
			);
		}

		return response.json(
			callback,
			{
				result: {
					code: 2001,
					message: 'consents founded',
					consents: consents,
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
					message: 'consents not founded try again',
					error,
				},
			},
			500
		);
	}
};
