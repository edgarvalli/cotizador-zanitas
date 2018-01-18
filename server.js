const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const PORT = 8080;
const SSLPORT = 8443;
const { headers, sessionConfig } = require("./func");

const key = fs.readFileSync(__dirname + "/certificates/zanitas.key", "utf8");
const cert = fs.readFileSync(__dirname + "/certificates/zanitas.crt", "utf8");

const sslServer = https.Server({key, cert, passphrase: "HMe090529"},app)


const itemsRouter = require("./api/cotizador/items/items.route");
const quotesRouter = require("./api/cotizador/quotes/quotes.route");
const authApiRouter = require("./api/cotizador/auth/auth.route");
const usersRouter = require("./src/cotizador/users/users.route");
const printRouter = require("./src/cotizador/print/print.route");

app
    .use(headers)
    .use(express.static("public"))
    .use(bodyParser.urlencoded({extended: false, limit: "50mb"}))
    .use(bodyParser.json({limit: "50mb"}))
    .use(session(sessionConfig))
    .set("view engine","pug")

app
    .get("/", (req,res) => res.send("Express works"))
    .get("/api/cotizador",(req,res) => res.send("works"))
    .get("/cotizador", (req,res) => res.sendFile("./index.html"))
    .post("/api/cotizador/test", (req,res) => {
        console.log(req.headers)
        res.json({work: true})
    })

app
    .use("/cotizador/users", usersRouter)
    .use("/api/cotizador/items", itemsRouter)
    .use("/api/cotizador/quotes", quotesRouter)
    .use("/api/cotizador/auth", authApiRouter)
    .use("/cotizador/print",printRouter)

app.listen(PORT, err => err ? console.log(err)
                : console.log("Server running on port: " + PORT))
sslServer.listen(SSLPORT, err => err ? console.log(err)
        : console.log("Server running on secure port: " + SSLPORT))