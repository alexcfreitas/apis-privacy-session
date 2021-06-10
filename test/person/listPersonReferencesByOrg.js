const dynamodb = require('../../shared/lib/dynamo');

/**
 * List Identifier assigned Person of Organization on DynamoDB
 * This endpoint receive a simple GET with queryparams
 */
const { getId, getApiKey } = require("../../shared/lib/encryption");

const DYNAMO_TABLE = "test-privacy-apis-ERD";

const listPersonReferencesByOrg = async event => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  const ORG_ID = data.org_id;
  const PERSON_ID = data.person_id;

  let params = {
    TableName: DYNAMO_TABLE,
    KeyConditionExpression: "#PK = :PK",
    ExpressionAttributeNames: {"#PK":"PK"},
    ExpressionAttributeValues: {
      ":PK":`ORG#${ORG_ID}#PERS#${PERSON_ID}`,
    }
  };

  return await dynamodb.list(params);
};

(async () => {
  const listPersonReferences = await listPersonReferencesByOrg({
    org_id: "a115f8136c2d4fb1944c069d110dc1cc",
    person_id: "e05e78e1c80d46b488f3026f91c7a9df"
  });

  console.log("PERSON-REFERENCES --> ", JSON.stringify(listPersonReferences, null, 2));
})();


/**
 * Exemple Possible Persons ID
 *  -> Alex -> e05e78e1c80d46b488f3026f91c7a9df
 *  -> Francisco -> b2206803d63e434190ebc4f650d2aa18
 *  -> Joao -> 726f61049d1d4a89979821fbfd04f8e9
 *  -> Juliana -> 6adbfec746dc410a9bb29c3e31c5d25f
 *  
 */