const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "z4n1t4$s3cur1typ4ssw0rd";

module.exports = {
    headers(req,res,next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
        next();
    },

    sessionConfig: {
    	secret,
        resave: false,
        saveUninitialized: false
    },

    createToken(payload, exp = 1444) {
        payload.exp = moment().add(1, "day").unix();
        const token = jwt.encode(payload, secret)
        return token;
    },

    decodeToken(token) {
        const decode = jwt.decode(token, secret);
        return decode;
    },

    isAuth(req,res,next) {
        try {
            if(!req.headers.token) return res.json({error: true, msg: "No proporciono el token"})
            const token = jwt.decode(req.headers.token, secret,true);
            if(token.exp >= moment().unix()) {
                req.user = token.user
                next();
            } else {
                res.json({error: true, msg: "Usuario no autorizado"})
            }
        } catch(err) {
            console.log(err);
            res.json({error: true, msg: "Usuario no autorizado"})
        }
    }
}