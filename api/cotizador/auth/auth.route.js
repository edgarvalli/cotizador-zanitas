const express = require("express");
const router = express.Router();
const auth = require("./auth.class");

router
	.get("/userinfo", auth.getUserInfo)
	.post("/login", auth.isAuth)
	.get("/verify",auth.verify)
	.post("/changepass", auth.changePass)

module.exports = router;