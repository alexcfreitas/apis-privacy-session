"use strict";
const {
  Session,
  Identifier,
  Person,
  PersonIdentifier,
  PersonSession,
} = require("common").Service;

const response = require("common").Response;
const Paylod = require("../event.json");
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

    const personIdentifier = await PersonIdentifier.findPersonIdentifierByIdenValue(
      {
        org_id: asset.org_id,
        person_identifier_value: data.identifier.value,
      }
    );

    if (
      Object.keys(personIdentifier).length > 0 &&
      personIdentifier.org_id === asset.org_id
    ) {
      return response.json(
        callback,
        {
          result: {
            code: 4001,
            message: `session has already been recorded`,
          },
        },
        400
      );
    }

    const identifier = await Identifier.findIdentifierByKey({
      org_id: asset.org_id,
      identifier_key: data.identifier.key,
    });

    if (Object.keys(identifier).length === 0) {
      return response.json(
        callback,
        {
          result: {
            code: 4001,
            message: `identifier ${data.identifier.key} does not exist`,
          },
        },
        400
      );
    }

    // Create Person
    const { person_id } = await Person.create({
      org_id: asset.org_id,
    });
    // Create Session
    const { session_id } = await Session.create({
      org_id: asset.org_id,
      spvll: data.spvll,
    });
    // Create Person-Identifier
    const person_identifier = await PersonIdentifier.create({
      org_id: asset.org_id,
      person_id,
      identifier_id: identifier.identifier_id,
      person_identifier_key: data.identifier.key,
      person_identifier_value: data.identifier.value,
    });
    // Create Person-Session
    const person_session = await PersonSession.create({
      org_id: asset.org_id,
      person_id,
      session_id,
      person_identifier_key: data.identifier.key,
      person_identifier_value: data.identifier.value,
      spvll: data.spvll,
    });

    return response.json(
      callback,
      {
        result: {
          code: 2001,
          message: "session successfully recorded",
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
          message: "session not recorded try again",
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
