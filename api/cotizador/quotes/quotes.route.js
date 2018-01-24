const express = require("express");
const router = express.Router();
const quotes = require("./quotes.class");
const { isAuth } = require("../../../func");

//router.use((req,res,next) => req.session.isAuth ? next() : res.send("Usuario no autorizado") )

router
    .get("/fetch/:page",isAuth, quotes.fetch)
    .get("/getone/:id",isAuth, quotes.getOne)
    .post("/add",isAuth, quotes.add)

module.exports = router;