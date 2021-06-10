"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require("../../shared/lib/encryption");

const DYNAMO_TABLE = "test-privacy-apis-ERD";
/**
 * Register a Person-Consent on DynamoDB
 * This endpoint receive a simple POST Payload like this:
 * {
 *   "org_id": "a115f8136c2d4fb1944c069d110dc1cc",
 *   "person_id": "",
 *   "consent_id": ""
 * }
 * After receive a simple payload:
 * Register on DynamoDB Table
 */
const createPersonConsent = async (event) => {
  try {
    const data = event.body ? event.body : event;

    /**@TODO Validate Informations.*/
    
    const ORG_ID = data.org_id;
    const PERSON_ID = data.person_id;
    const CONSENT_ID = data.consent_id;
    const PERSON_CONSENT_ID = getId();
  
    let params = {
      TableName: DYNAMO_TABLE,
      Item: {
        PK: `ORG#${ORG_ID}#PERS#${PERSON_ID}`,
        SK: `ORG#${ORG_ID}#CONS#${CONSENT_ID}`,
        person_consent_id: PERSON_CONSENT_ID,
        created_at: new Date().toUTCString(),
      },
    };

    const personConsent = dynamodb.put(params).promise();

    return params;
  } catch (error) {
    console.log(
      "Unable to create item in table. Error JSON:",
      JSON.stringify(error, null, 2)
    );
    console.log("Rejection for PERSON-CONSENT:", params);
  }
};

(async () => {
  const personConsentCreated = await createPersonConsent({
    org_id: "a115f8136c2d4fb1944c069d110dc1cc",
    person_id: "e05e78e1c80d46b488f3026f91c7a9df",
    consent_id: "67af6393e86a417da43dd165e84f04e4"
  });

  console.log("PERSON-CONSENT --> ", JSON.stringify(personConsentCreated, null, 2));
})();

/**
 * Exemple Possible Payloads
 * Person
 *  -> Alex -> e05e78e1c80d46b488f3026f91c7a9df
 *  -> Francisco -> b2206803d63e434190ebc4f650d2aa18
 *  -> Joao -> 726f61049d1d4a89979821fbfd04f8e9
 *  -> Juliana -> 6adbfec746dc410a9bb29c3e31c5d25f
 *
 * Consent
 *  -> 67af6393e86a417da43dd165e84f04e4
 */