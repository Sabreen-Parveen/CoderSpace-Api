const dynamoose = require("dynamoose");

const ACCESSKEYID = process.env.ACCESSKEYID;
const SECRETACCESSKEY = process.env.SECRETACCESSKEY;
const REGION = process.env.AWS_REGION;

module.exports = function establishDbConnection() {
  const productionDB = new dynamoose.aws.sdk.DynamoDB({
    accessKeyId: ACCESSKEYID,
    secretAccessKey: SECRETACCESSKEY,
    region: REGION,
  });
  dynamoose.aws.ddb.set(productionDB);
};
