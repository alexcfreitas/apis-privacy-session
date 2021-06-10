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
    const personSession = await PersonSession.findPersonSessionByIdenValue(
      {
        org_id: asset.org_id,
        person_identifier_value: data.identifier.value,
      }
    );

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
          message: "session not ended try again",
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
