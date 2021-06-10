"use strict";
const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const DYNAMO_TABLE = "test-privacy-apis-ERD";
/**
 * List All Identifiers of Organization on DynamoDB
 * This endpoint receive a simple GET with queryparams
 */

const listIdentifiersByOrganizationId = (event) => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  const ORG_ID = data.org_id;

  let params = {
    TableName: DYNAMO_TABLE,
    KeyConditionExpression: "#PK = :PK and begins_with(#SK, :SK)",
    ExpressionAttributeNames: {"#PK":"PK", "#SK":"SK"},
    ExpressionAttributeValues: {
      ":PK":`ORG#${ORG_ID}`,
      ":SK": `IDEN#`
    }
  };

  dynamodb.query(params, function (err, data) {
    if (err) {
      console.log(
        "Unable to create item in table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      console.log("Rejection for newSession:", params);
    } else {
      console.log("ORGANIZATION --> ", JSON.stringify(data, null, 2));
    }
  });
};

(() => {
  listIdentifiersByOrganizationId({
    org_id: "a115f8136c2d4fb1944c069d110dc1cc"
  });
})();
