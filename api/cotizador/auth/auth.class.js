const mongo = require("../../../lib/mongo.client")("cotizador");
const bcrypt = require("bcrypt");
const { createToken, decodeToken } = require("../../../func");
const db = "users";
class Auth {

	getUserInfo(req, res) {
		res.json({
			user: {
				username: req.session.username,
				userId: req.session.userId,
				profile: req.session.profile,
			},
			options: req.session.options
		})
	}

	verify(req,res) {
		const payload = {
			user: "Edgar",
			userId: "989jnkjskjk19i9"
		}

		const token = createToken(payload);
		console.log(token);
		res.json({work: true})
	}

	changePass(req,res) {

		const { username, last_pass, new_pass } = req.body;

		mongo(db).findOne({username}, (err, user) => {
			if(user)
			{
				bcrypt.compare(last_pass, user.password, (err, auth) => {
					if(auth) 
					{
						bcrypt.genSalt(10, (err,salt) => {
							bcrypt.hash(new_pass, salt, (err, hash) => {
								mongo(db).update({_id: user._id}, {$set: {password: hash}}, err => {
									err ? res.send({error: true, msg: "Ocurrio un error al acutalizar"})
										: res.send({error: false, msg: "Actualizacion con exito"})
								})
							})
						})
					}
				})
			}
		})

	}

	isAuth(req,res) {
		const { username, password } = req.body.cred;
    	mongo(db).findOne({username}, (err, user) => {
			if(err) return res.json({error: true, msg: "Usuario no existe o esta mal escrito"});
    		if(user) {
    			
				//Verify if the user is active
				if(!user.active) return res.json({error: true, msg: "Usuario no activo"});

    			bcrypt.compare(password,user.password, (err, auth) => {
    				if(auth) {

						const payload = { user }
						const token = createToken(payload);
						res.json({
							error: false,
							isAuth: true,
							token,
							user
						})

    				} else {
    					console.log("This is the error: " + err);
    					res.send({error: true, msg: "Contraseña incorrecta"})
    				}
    			})
    		} else {
    			res.json({error: true, msg: "Usuario no existe o esta mal escrito"})
    		}
    	})
	}

}

module.exports = new Auth();