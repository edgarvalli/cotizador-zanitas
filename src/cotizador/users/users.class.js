const mongo = require("../../../lib/mongo.client")("cotizador");
const bcrypt = require("bcrypt");

class User {

	home(req,res) {
		res.render("cotizador/users/index")
	}
	
	login(req, res) {
		res.render("cotizador/login")
	}

    newUser(req,res) {
		res.render("cotizador/users/new-user",{
			inputs: [
				{
					name: "name",
					display: "Nombre",
					type: "text"
				},
				{
					name: "username",
					display: "Usuario",
					type: "text",
					required: "required"
				},
				{
					name: "password",
					display: "Contraseña",
					type: "password",
					required: "required"
				}
			]
		})
    }

    fetch(req, res) {
    	mongo("users").find({}, (err, users) => {
			res.render("cotizador/users/list-users",{users})
    	})
    }

    add(req,res) {
		const data = req.body;
		mongo("users").findOne({username: data.username}, (err, user) => {
			if(user) return res.send("User exist");
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(data.password, salt, (err, hash) =>{
					data.password = hash;
					mongo("users").insert(data, err => {
						if(err) {
							res.send("Ocurrio un error")
							console.log(err)
						} else {
							res.redirect("/cotizador/users/list")
						}
					})
				})
			})
		})

	}
	
	isAuth(req,res) {
    	const { username, pass } = req.body;
    	mongo("users").findOne({username}, (err, user) => {
    		if(err) return console.log(err);
    		if(user) {
    			bcrypt.compare(pass,user.password, (err, auth) => {
    				if(auth) {
						req.session.username =  user.username;
						req.session.userId =  user._id;
						req.session.name = user.name;
						req.session.profile = user.profile;
						req.session.isAuth = true;
						res.redirect("/cotizador/users/")
    				} else {
    					console.log(err);
    					res.send("No se pudo autenticar, <a href='/cotizador/auth/loginpage'>Regresar</a>")
    				}
    			})
    		} else {
    			console.log(err)
    			res.render("cotizador/login", {error: true})
    		}
    	})
    }
    
}

module.exports = new User();
