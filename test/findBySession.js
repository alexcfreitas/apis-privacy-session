"use strict";
const {
  Session,
  Identifier,
  Person,
  PersonIdentifier,
  PersonConsent,
  Consent
} = require("common").Service;

const response = require("common").Response;

const Paylod = require("./event.json");

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
    // const asset = JSON.parse(event.requestContext.authorizer.asset);
    const asset = event.requestContext.authorizer.asset;
    // const data = JSON.parse(body);

    const personIdentifier = await PersonIdentifier.findPersonIdentifierByIdenValue(
      {
        org_id: asset.org_id,
        person_identifier_value: data.identifier.value,
      }
    );

    if (Object.keys(personIdentifier).length === 0) {
      return response.json(
        callback,
        {
          result: {
            code: 4041,
            message: "Person not founded",
          },
        },
        404
      );
    }
    
    let isSameIdentifierKey =
      personIdentifier.person_identifier_key === data.identifier.key;

    if (!isSameIdentifierKey) {
      return response.json(
        callback,
        {
          result: {
            code: 4001,
            message: `Person founded but is not same Identifier Key try again`,
          },
        },
        400
      );
    }

    // Find Person-Consent
    const person_consent = await PersonConsent.findPersonConsentByIdenValue({
      org_id: asset.org_id,
      person_identifier_value: data.identifier.value,
    });

    if (Object.keys(person_consent).length === 0) {
      return response.json(
        callback,
        {
          result: {
            code: 4001,
            message: `person consent does not exist`,
          },
        },
        400
      );
    }

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "person consent founded",
          consent: person_consent
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
          message: "person consent not founded try again",
          error,
        },
      },
      500
    );
  }
};

const callback = (erro, data) => {
  console.info("*******************");
  console.info(
    "Erro: ",
    erro === null ? "Não há erros" : JSON.stringify(erro, null, 2)
  );
  console.info("*******************");
  console.info("Sucesso: ", JSON.stringify(data, null, 2));
  console.info("*******************");
};

(async () => {
  let test = run(Paylod, {}, callback);

  console.log("RESULT --> ", JSON.stringify(test, null, 2));
})();
