const router = require("express").Router();
const upload = require("multer")({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const controller = require("./controllers");

router
  .route("/file/:id")
  .get(controller.getFileController)
  .put(upload.array("file"), controller.updateFileController)
  .delete(controller.deleteFileController);

router
  .route("/files")
  .post(upload.array("files"), controller.uploadFileController);

router.route("/files/user/:id").get(controller.getFilesBySubIdController);
// router.route("/online-compiler/execute").get(contro)
router
  .route("/user/:userId")
  .get(controller.getUser)
  .post(controller.createUser)
  .patch(controller.updateUser);

router
  .route("/analytics/leetcode/:username")
  .get(controller.getLeetCodeProfile);

module.exports = router;
