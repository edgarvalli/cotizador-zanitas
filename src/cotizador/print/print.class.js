const pug = require("pug");
const h2p = require("html-pdf");
const path = require("path");
const mongo = require("../../../lib/mongo.client")("cotizador");
const db = "quotes";

class Print {

	renderPage(req,res) {
		const id = "5a298501829a8e13c49ca89e";
		mongo(db).findOne({_id: mongo(db).id(id)}, (err, quote) => {
			const prefix = ["mat","ser","med","lab","ima"];
			const items = [];
			
			prefix.map( pre => {
				if(quote[pre].items.length > 0) {
					quote[pre].items.map( obj => {
						obj.subtotal = (parseInt(obj.cant) * parseFloat(obj.sell_price.replace(/,/g, ''))).toFixed(2)
						items.push(obj)
					})
				} else { console.log("Array empty") }
			})
			mongo("users").findOne({_id: mongo(db).id(quote.create_by)}, (err, user) => {
				res.render("cotizador/print_page",{items, quote, user});
			})
			
		}) 
	}

	renderPdf(req,res) {
		const id = req.params.id;
		mongo(db).findOne({_id: mongo(db).id(id)}, (err, quote) => {
			if(err) return console.log(err)
			const prefix = ["mat","ser","med","lab","ima"];
			const items = [];
			
			prefix.map( pre => {
				if(quote[pre].items.length > 0) {
					quote[pre].items.map( obj => {
						obj.subtotal = (parseInt(obj.cant) * parseFloat(obj.sell_price.replace(/,/g, ''))).toLocaleString("es-MX", {minimumFractionDigits: 2})
						items.push(obj)
					})
				}
			})
			mongo("users").findOne({_id: mongo("users").id(quote.create_by)}, (err, user) => {
				if(err) return console.log("Error when tried to find user")
				const html = pug.renderFile(path.join(__dirname, "../../../views/cotizador/print_page.pug"), {
					items, quote, user
				});
				const options = {
					format: "letter",
					border: "10px",
					"footer": {
						"height": "10mm",
						"contents": {
						  default: '<span style="color: #444;">Los Medicamentos no tienen IVA</span>'
						}
					}
				}
		        h2p.create(html,options).toFile("./public/repo/quote.pdf", err => {
		            err ? console.log("Error when tried to create pdf",err)
		            : res.send("/repo/quote.pdf")
	        	})
			})
		})
	}

}

module.exports = new Print();
