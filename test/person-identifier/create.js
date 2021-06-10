"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require("../../shared/lib/encryption");

const DYNAMO_TABLE = "test-privacy-apis-ERD";
/**
 * Register a Person-Identifier on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *   "org_id": "a115f8136c2d4fb1944c069d110dc1cc",
 *   "person_id": "",
 *   "identifier_id": "",
 *   "identifier_value": ""
 * }
 * After receive a simple payload:
 * Register on DynamoDB Table
 */
const createPersonIdentifier = (event) => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  const ORG_ID = data.org_id;
  const PERSON_ID = data.person_id;
  const IDENTIFIER_ID = data.identifier_id;
  const PERSON_IDENTIFIER_ID = getId();

  let params = {
    TableName: DYNAMO_TABLE,
    Item: {
      PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
      SK: `ORG#${ORG_ID}#IDEN#${IDENTIFIER_ID}`,
      person_identifier_id: PERSON_IDENTIFIER_ID,
      person_identifier_value: data.person_identifier_value,
      created_at: new Date().toUTCString(),
    },
  };

  dynamodb.put(params, function (err, data) {
    if (err) {
      console.log(
        "Unable to create item in table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      console.log("Rejection for newSession:", params);
    } else {
      console.log("PERSON-IDENTIFIER --> ", JSON.stringify(data, null, 2));
    }
  });
};

(() => {
  createPersonIdentifier({
    org_id: "a115f8136c2d4fb1944c069d110dc1cc",
    person_id: "e05e78e1c80d46b488f3026f91c7a9df",
    identifier_id: "46817266753c486ea030a5c6315c44ea",
    person_identifier_value: "555500000002100223113271",
  });
})();

/**
 * Exemple Possible Payloads
 * Person
 *  -> Alex -> e05e78e1c80d46b488f3026f91c7a9df
 *  -> Francisco -> b2206803d63e434190ebc4f650d2aa18
 *  -> Joao -> 726f61049d1d4a89979821fbfd04f8e9
 *  -> Juliana -> 6adbfec746dc410a9bb29c3e31c5d25f
 *
 * Identifier
 *  -> cpf -> c62ccbe587124ae39fe2a3a2fc33b970
 *  -> cbenef -> 7302b7141b884d03856f68971018e56b
 *  -> carteirinha -> 46817266753c486ea030a5c6315c44ea
 *  -> ra -> 173e1bc55f944388b0d47efd6aae7fa7
 *  
 */