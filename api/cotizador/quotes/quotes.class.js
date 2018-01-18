const fs = require("fs");
const path = require("path");
const parse = require("csv-parse");
const mongo = require("../../../lib/mongo.client")("cotizador");
const db = "quotes";


class Quote {

    fetch(req,res) {

        const querys = {
            select: {
                name: 1,
                phone: 1,
                total: 1,
            }
        }

        mongo(db).find(querys, (err, docs) => err ? console.log(err) : res.send(docs))
    }

    add(req,res) {
        const data = req.body;
        data.date = new Date();
        data.create_by = req.user._id;
        mongo(db).insert(data, err => err ? console.log(err) : res.send({error: false}))
    }

    getOne(req,res) {
        
        function formatDate(date) {
            
            const day = ("0" + (date.getDate())).slice(-2);
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            
            date = date.getFullYear() + "-" + month + "-" + day;

            return date;
        }

        const id = mongo(db).id(req.params.id);
        mongo(db).findOne({_id: id}, (err, data) => {

            if(err) {
                console.log(err)
            } else {
                data.date = formatDate(data.date);
                res.json(data)
            }
        })
    }

    formatDate(date) {
        const newDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay()
        return newDate;
    }

}

module.exports = new Quote;