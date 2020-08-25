const express = require("express");
const router = express.Router();

const ChitterCtrl = require("../controllers/chitter.controller");
const AuthCtrl = require("../controllers/auth.controller");

router
  .route("/")
  .get(AuthCtrl.requireSignIn, ChitterCtrl.list)
  .post(AuthCtrl.requireSignIn, ChitterCtrl.create);

router
  .route("/:id")
  .get(AuthCtrl.requireSignIn, ChitterCtrl.read)
  .delete(AuthCtrl.requireSignIn, ChitterCtrl.hasAuth, ChitterCtrl.remove);
router
  .route("/:id/comment")
  .post(AuthCtrl.requireSignIn, ChitterCtrl.newComment);

router.param("id", ChitterCtrl.findById);

module.exports = router;
