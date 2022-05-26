const sanitizeFilename = require("./utils/sanitizeFileName");
const S3 = require("./services/s3/s3Operations");
const db = require("./db/dbOperations");
const CSError = require("./error/customErrors");
const { ApplicationInsights } = require("dynamoose/dist/aws/sdk");
const axios = require("axios");

exports.createUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const data = req.body;
    console.log(req.body);
    // const { value: data, error } = Validations.createBrandValidation(req.body);
    // if (error) {
    //   return next(CSError.ValidationError(error.message));
    // }
    const user = await db.CreateUserByUserId(userId, data);
    console.log(user);
    res.status(200).json({
      user,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    console.log(req.body);
    const data = req.body;
    console.log(data);
    const updatedUser = await db.UpdateUserByUserID(userId, data);

    res.status(200).json({
      updatedUser,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await db.GetUserById(userId);
    if (userId.length === 0) {
      next(CSError.UserNotFound());
      return;
    }
    res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
};

function isFileNotAccessible(fileData) {
  return fileData === undefined || fileData.softDelete;
}

async function createEntryInDb(client, fileData) {
  console.log(fileData);
  const params = {
    subId: client.subId,
    versionId: fileData.versionId,
    path: fileData.path,
    clientName: client.clientName,
    fileSize: fileData.file.size,
    fileType: client.fileType,
    mimeType: fileData.file.mimetype,
  };
  return await db.createFileEntry(params);
}

async function uploadFiles(files, clientData) {
  const fileSubmissionResponses = [];
  for (const file of files) {
    const fileName = sanitizeFilename(file.originalname);
    const filePath = `${clientData.subId}/${fileName}`;
    const s3Response = await S3.uploadFile(filePath, file.buffer);
    const fileEntryResponse = await createEntryInDb(clientData, {
      path: filePath,
      file,
      versionId: s3Response.VersionId,
    });
    fileSubmissionResponses.push(fileEntryResponse);
  }
  return fileSubmissionResponses;
}

exports.uploadFileController = async (req, res, next) => {
  try {
    const files = req.files;
    const clientData = req.body;
    const fileSubmissionResponses = await uploadFiles(files, clientData);
    res.json({
      fileSubmissionResponses,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFileController = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const fileData = await db.getFileEntryById(fileId);
    if (isFileNotAccessible(fileData)) {
      return next(CSError.FileDoesNotExist());
    }
    await db.updateAccessTime(fileId);
    const fileAccessUrl = await S3.generateSignedUrl(
      fileData.path,
      fileData.versionId
    );
    res.json({
      getFileResponse: {
        data: fileData,
        fileAccessUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateFileController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const file = req.files[0];
    const fileData = await db.getFileEntryById(id);
    if (isFileNotAccessible(fileData)) {
      return next(CSError.FileDoesNotExist());
    }
    const { path } = fileData;
    const s3Response = await S3.uploadFile(path, file.Buffer);
    const updatedData = await db.updateFileEntry(id, {
      fileSize: file.size,
      versionId: s3Response.VersionId,
    });
    res.json({
      updateFileResponse: updatedData,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteFileController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const fileData = await db.getFileEntryById(id);
    if (isFileNotAccessible(fileData)) {
      return next(CSError.FileDoesNotExist());
    }
    const { path, versionId } = fileData;
    const file = await S3.getFileData(path, versionId);

    await S3.deleteFile(path, versionId);
    const glacierResponse = await glacier.uploadToArchieve(file);
    await db.pseudoDeleteFileEntry(id, glacierResponse.archiveId);
    res.json({
      deleteFileResponse: fileData,
      glacierResponse,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFilesBySubIdController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = [];
    const filesData = await db.getFilesEntryBySubId(id);
    for (const file of filesData) {
      await db.updateAccessTime(file.id);
      const fileUrl = await S3.generateSignedUrl(file.path, file.versionId);
      response.push({
        fileData: file,
        url: fileUrl,
      });
    }
    res.json({
      getFilesBySubIdResponse: response,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLeetCodeProfile = async (req, res, next) => {
  const username = req.params.username;
  axios
    .get(`https://leetcode-stats-api.herokuapp.com/${username}`)
    .then((response) => {
      console.log(response.data);
      res.json({
        getLeetcodeProfile: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
/*
Example event:

const event = {
  Type: "Notification",
  MessageId: "b276f1f7-8bf3-5483-94d6-a821cf5a5350",
  TopicArn: "*****",
  Message: {
    Action: "ArchiveRetrieval",
    ArchiveId:
      "9yXg6Ppn-Ma6Bhh8e5IfxsE91C6p0BkBblI3T2nIRwG_tF6G29kqYmXskeqUdpLNh7k68JNNMRnxfLyx6I2xAWxSEfXEGj5FKTtcwqsLgfdI_UjAj9lmiJHVGdR4L6nqKL9duwHYWQ",
    ArchiveSHA256TreeHash:
      "76ac7969e385b6f05e83c364b01a5751f3c6925c57779bf6e1a2abf44ae4442a",
    ArchiveSizeInBytes: 67807,
    Completed: true,
    CompletionDate: "2021-10-05T12:17:45.341Z",
    CreationDate: "2021-10-05T08:33:38.654Z",
    InventoryRetrievalParameters: null,
    InventorySizeInBytes: null,
    JobDescription: null,
    JobId:
      "iC6W0xLoiftSj7fYyoeniCTuBc8Ji7fso7k9KKBHOtZZvIvY_bNkXxMtQRuF7rxpWkbiQSEBPr9qyrvqs85vOdW0pGrI",
    RetrievalByteRange: "0-67806",
    SHA256TreeHash:
      "76ac7969e385b6f05e83c364b01a5751f3c6925c57779bf6e1a2abf44ae4442a",
    SNSTopic: "******",
    StatusCode: "Succeeded",
    StatusMessage: "Succeeded",
    Tier: "Standard",
    VaultARN: "*******",
  },
  Timestamp: "2021-10-05T12:17:45.391Z",
  SignatureVersion: "1",
  Signature:
    "OGJY/+f0SpjhhvzbNSCc8SER7S9uF9/rK/xdzbHvZo+DtCIMJ9nAucuxrLI9cjwaKovigN1m6v3DbX20DWcs83s8LEvSpezWRpissF7KswfPwIgSIhTkFIQZcYW2AU4iS0Estx167ovLPg6Qkpk5tmmDJizHmRKejklPolkgZE3YCC8Dpd3WpKlYvaTyqj6bxbqLSNucF61Tw466nY1KouHLZTSJle/U9vXnrfeO+jf25om2wxONlFj/JA/LAyyMKohf/T7+Pt3oIHZ9XrumnlQQO19uv5HScjxOAV7Dpjhn+wZUQBo5FDRrE0Meq3l+8JBDGy187YuKJQgR+EMA/w==",
  SigningCertURL:
    "******",
  UnsubscribeURL:
    "******",
};
*/
