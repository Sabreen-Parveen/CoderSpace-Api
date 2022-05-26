const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = require("./s3Client");

exports.uploadFile = async (filename, file) => {
  return await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKETNAME,
      Key: filename,
      Body: file,
    })
  );
};

exports.generateSignedUrl = async (key, version) => {
  const bucketParams = {
    Bucket: process.env.BUCKETNAME,
    Key: key,
    Version: version,
  };
  const command = new GetObjectCommand(bucketParams);
  const signedUrl = await getSignedUrl(s3Client, command);
  return signedUrl;
};

exports.deleteFile = async (key, version) => {
  const bucketParams = {
    Bucket: process.env.BUCKETNAME,
    Key: key,
    Version: version,
  };
  return await s3Client.send(new DeleteObjectCommand(bucketParams));
};

exports.getFileData = async (key, version) => {
  const bucketParams = {
    Bucket: process.env.BUCKETNAME,
    Key: key,
    Version: version,
  };
  return await s3Client.send(new GetObjectCommand(bucketParams));
};
