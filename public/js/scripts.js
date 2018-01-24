const events = {

	id: "",
	values:{},

	options(data) {
		return {
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			method: "post",
			body: JSON.stringify(data)
		}
	},

	change(e) {
		const name = $(e).attr("name");
		this.values[name] = $(e).val(); 
	},

	remove(e) {
		const id = e.getAttribute("userid");
		fetch(`${window.location.origin}/cotizador/users/remove/${id}`)
		.then(resp => resp.json())
		.then(({error, msg}) => {
			if(!error) {
				e.closest("tr").remove();
			} else {
				alert("Ocurrio un error al eliminar")
			}
		})
	},

	update(e){
		this.id = e.getAttribute("userid");
		
		console.log(this.values)
	},

	checked(e) {
		this.values.active = e.checked;
	},

	showForm(e) {
		this.id = e.getAttribute("userid");
		$("#modal").modal("show");
	},

	changePass(e) {
		
		const { password, r_password } = this.values;

		if(password === r_password){

			fetch("/cotizador/users/changepass", this.options({id: this.id, password}))
			.then(resp => resp.json())
			.then(({error, msg}) => {
				if(!error) {
					this.closeModal();
				} else {
					alert("Ocurrio un error al cambiar la contraseña");
					console.log(msg)
				}
			})
		} else {
			alert("Hay un error en la contraseña, deben ser igual")
		}

	},

	closeModal() {
		$("#modal").modal("hide");
		$("#r_pass").val("");
		$("#pass").val("");
	}	

}