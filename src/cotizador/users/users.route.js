const express = require('express');
const router = express.Router();
const user = require('./users.class');

const auth = (req,res,next) => {
	const { isAuth, profile } = req.session;
	    ( isAuth && profile === "admin") ? next() 
	        : res.redirect("/cotizador/users/loginpage")
}

router
	.get("/", auth,user.home)
	.get("/loginpage", user.login)
	.post("/auth", user.isAuth)
    .get("/new",auth, user.newUser)
    .get("/show/:id",auth, user.showUser)
    .get("/list",auth, user.fetch)
    .post("/add",auth, user.add)
    .post("/update", auth, user.updateUser)
    .get("/remove/:id", user.remove)
    .post("/changepass", user.changePassword)

module.exports = router;
