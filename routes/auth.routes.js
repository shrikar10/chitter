const express = require("express");
const router = express.Router();

const authCtrl = require("../controllers/auth.controller");

router.route("/signin").post(authCtrl.signin);
router.route("/signout").get(authCtrl.signout);

module.exports = router;
