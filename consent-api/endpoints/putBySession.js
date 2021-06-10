'use strict';
const { Consent, PersonSession, PersonConsent } = require('common').Service;
const encryption = require('common').Encryption;
const sqs = require('common').Queue;
const response = require('common').Response;
const ENV = process.env.ENV;
/**
Register a Consent and Person-Consent on DynamoDB
This endpoint receibe a simple PUT Payload like this:
  {
    "spvll":"xxxxxxxxx",
    "consents": [  
     {
        "isAccepted": true,
        "consentTypeId": 1
     },
     {
        "isAccepted": false,
         "consentTypeId": 2
     },
   ]
  }
After receive a simple payload:
Register on DynamoDB Table
 */
module.exports.run = async (event, context, callback) => {
	try {
		console.log(
			` **************** Event Request **************** `,
			JSON.stringify(event, null, 2)
		);

		const body = event.body ? event.body : event;
		const data = JSON.parse(body);
		// const asset = { org_id: '233455000989' }; //RemoveBeforeDeploy

		const { spvll, consents, ips, header } = data;
		const { org_id } = await PersonSession.findBySPVLL(spvll);

		const consentsRecorded = [];
		const consentsToRecordedSQS = [];

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

		if (consents.length > 0) {
			for await (let consent of consents) {
				const { consentTypeId, isAccepted } = consent;
				// Save Consent
				const { consent_id } = await Consent.create({
					org_id,
					person_id: personSession.person_id,
					consent_id: consentTypeId,
				});

				// Save Person-Consent
				const person_consent = await PersonConsent.create({
					org_id,
					person_id: personSession.person_id,
					consent_id,
					spvll,
					ips,
					header,
					consent_type_id: consentTypeId,
					is_accepted: isAccepted,
					person_identifier_key: personSession.person_identifier_key,
					person_identifier_value: personSession.person_identifier_value,
				});

				if (Object.keys(person_consent).length > 0) {
					const {
						consent_type_id,
						is_accepted,
						consent_at,
						ips,
						header,
					} = person_consent;
					consentsRecorded.push({
						consentTypeId: consent_type_id,
						isAccepted: is_accepted,
						consentAt: consent_at,
					});
					consentsToRecordedSQS.push({
						environment: ENV,
						spvll: data.spvll,
						organizationId: org_id,
						identifier: {
							key: personSession.person_identifier_key,
							value: personSession.person_identifier_value,
						},
						consent: {
							typeId: consent_type_id,
							isAccepted: is_accepted,
							consentAt: consent_at,
						},
						ips,
						header,
					});
				}
			}
		}

		const sendConsents = await sqs.sendToQueue({
			key: encryption.getId(),
			consents: consentsToRecordedSQS,
		});

		if (sendConsents) {
			return response.json(
				callback,
				{
					result: {
						code: 2001,
						message: 'consents successfully recorded',
						consents: consentsRecorded,
					},
				},
				200
			);
		} else {
			throw new Error();
		}
	} catch (error) {
		return response.json(
			callback,
			{
				result: {
					code: 5001,
					message: 'consent not recorded try again',
					error,
				},
			},
			500
		);
	}
};
