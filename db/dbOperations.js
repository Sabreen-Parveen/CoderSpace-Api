const uuid = require("uuid");

const File = require("./models/FileModel");
const User = require("./models/UserModel");
exports.CreateUserByUserId = (userId, data) => {
  return User.create({
    userId,
    ...data,
  });
};

exports.GetUserById = (userId) => {
  return User.query({ userId }).exec();
};

exports.UpdateUserByUserID = (userId, updatedValues = {}) => {
  console.log(updatedValues);
  return User.update({ userId }, updatedValues);
};

exports.createFileEntry = (fileData) => {
  const id = uuid.v4();
  return File.create({
    id,
    subId: fileData.subId,
    versionId: fileData.versionId,
    path: fileData.path,
    clientName: fileData.clientName,
    fileSize: fileData.fileSize,
    fileType: fileData.fileType,
    mimeType: fileData.mimeType,
  });
};

exports.getFileEntryById = (id) => {
  return File.get(id);
};

exports.pseudoDeleteFileEntry = (id, archiveId) => {
  // doesn't delete the entry, but marks them as deleted
  const newValues = {
    softDelete: true,
    archiveId: archiveId,
  };
  return File.update({ id }, newValues);
};

exports.updateFileEntry = (id, { fileSize, versionId }) => {
  return File.update(
    { id },
    {
      fileSize,
      versionId,
    }
  );
};

exports.getFilesEntryBySubId = (subId) => {
  return File.scan()
    .where("subId")
    .eq(subId)
    .where("softDelete")
    .eq(false)
    .exec();
};

exports.updateAccessTime = (id) => {
  const currentTime = Date.now();
  return File.update(
    { id },
    {
      lastAccessTime: currentTime,
    }
  );
};

exports.updateJobId = (id, jobId) => {
  return File.update(
    {
      id,
    },
    {
      jobId,
    }
  );
};

exports.getFileEntryByArchiveId = (archiveId) => {
  return File.scan().where("archiveId").eq(archiveId).exec();
};

exports.resetDeletionData = (id) => {
  return File.update(
    {
      id,
    },
    {
      archiveId: "",
      jobId: "",
      softDelete: false,
    }
  );
};
