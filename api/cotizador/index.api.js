const express = require("express");
const router = express.Router();

router
	.get("/",function(req,res) {
		if(req.session.isAuth) {
			res.send("Works")
		} else {
			res.redirect("/cotizador/login")
		}
	})
	.get("/login", function(req,res) {
		if(!req.session.isAuth) {
			res.render("cotizador/index")
		} else {
			res.redirect("/cotizador/")
		}
	})

module.exports = router;