const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "uploads/" });
const items = require("./items.class");
const { isAuth } = require("../../../func");

router
    .get("/fetch",isAuth ,items.fetch)
    .get("/search/:val",isAuth , items.search)
    .post("/upload",isAuth , upload.any(),items.store)

module.exports = router;