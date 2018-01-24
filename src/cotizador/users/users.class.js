const mongo = require("../../../lib/mongo.client")("cotizador");
const bcrypt = require("bcrypt");
const inputs = [
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
];

class User {

	home(req,res) {
		res.render("cotizador/users/index")
	}
	
	login(req, res) {
		res.render("cotizador/login")
	}

    newUser(req,res) {
		res.render("cotizador/users/new-user",{ inputs })
    }

    showUser(req,res) {
		const { id } = req.params;
		const _id = mongo("users").id(id);
		mongo("users").findOne({_id}, (err, user) => {

			if(err) {
				res.json({error: true, msg: err});
			} else {
				let display;
				switch(user.profile) {
					case "admin":
						display = "Administrador";
					break;

					case "supervisor":
						display = "Supervisor";
					break;

					case "user":
						display = "Usuario";
					break;

					default:
						display ="Usuario"
					break;
				}

				user.display = display;

				res.render("cotizador/users/show-user",{ user, inputs })
			}

		})
    }

	updateUser(req, res) {
		const { id, username, profile, name, active } = req.body;
		const _id = mongo("users").id(id);
		const set = { $set: { username, profile, name, active } };
		mongo("users").update({_id}, set, err => err ? res.json({error: true, msg: err})
						: res.redirect("/cotizador/users/list"))
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
					data.active = true;
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

	remove(req,res) {
		
		const { id } = req.params;
		const _id = mongo("users").id(id);
		mongo("users").remove({_id}, err => err ? res.json({error: true, msg: err})
				: res.json({error: false, msg: "success"}))
	
	}

	changePassword(req, res) {
		const { id, password } = req.body;
		
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) =>{
				if(err) {
					res.json({error: true, msg: err})
				} else {
					const data = {
						$set: { password: hash }
					}
					mongo("users").update({_id: mongo("users").id(id)}, data, err => {
						err ? res.json({error:true, msg: err})
							: res.json({error: false, msg: "success"})
					})
				}
	
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
