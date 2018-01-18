const express = require('express');
const router = express.Router();
const print = require("./print.class");

router
	.get("/printpage", print.renderPage)
	.get("/pdf/:id", print.renderPdf)

module.exports = router