"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "sa-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { getId, getApiKey } = require("../../shared/lib/encryption");

const DYNAMO_TABLE = "test-privacy-apis-ERD";
/**
 * Register a Organization on DynamoDB
 * This endpoint receibe a simple POST Payload like this:
 * {
 *   org_id: "a115f8136c2d4fb1944c069d110dc1cc"
 * }
 * After receive a simple payload:
 *
 * Register on DynamoDB Table
 */

const getOrganization = (event) => {
  const data = event.body ? event.body : event;

  /**@TODO Validate Informations.*/

  const ORG_ID = data.org_id;

  let params = {
    TableName: DYNAMO_TABLE,
    Key: { PK: `ORG#${ORG_ID}`, SK: `#METADATA#${ORG_ID}` },
  };

  dynamodb.get(params, function (err, data) {
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
  getOrganization({
    org_id: "a115f8136c2d4fb1944c069d110dc1cc"
  });
})();
