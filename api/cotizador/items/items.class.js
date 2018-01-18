const fs = require("fs");
const path = require("path");
const parse = require("csv-parse");
const mongo = require("../../../lib/mongo.client")("cotizador");
const db = "items";

class Items {

    fetch(req,res) {
        mongo(db).find({}, (err, data) => res.json(data) )
    }

    store(req, res) {
        
        /***** Handle file and move to public/repo/ *****/
        const file = req.files[0];
        const oldPath = path.join(__dirname,"../../../", "/uploads/" + file.filename);
        const newPath = path.join(__dirname,"../../..", "/public/repo/"+file.originalname);
        const cb = err => err ? console.log(err) : readCsv(file)
        /*********** END  ********************************/

        //Function for read CSV and store on MongoDB
        const readCsv =  (f) => {
            fs.readFile(path.join(__dirname,'../../..', '/public/repo/'+f.originalname), (error, data) => {
                
                if(error) return console.log("Error when try to read file\n" + error);
            
                parse(data,{trim: true}, (err,rows) =>{

                    if(err) return console.log("Error when try to parse the file read" + err);

                    //Function for store each row for the csv file

                    mongo(db).remove({}, err => err ? console.log("Error when try to remove data from database" + err)
                                        : storeData(rows))

                    const storeData = (arrays) => {

                        const data = [];

                        arrays.map( (item, i) => {
                            
                            if( i === 0 ) return null;
                            
                            const array = {};

                            item.map( (it, n) => {
                                array[arrays[0][n]] = it
                            })

                            data.push(array)
                        })

                        mongo(db).insertMany(data,msg => msg ? res.send({error: true, msg}) : null)

                        res.send("success")
                        
                    }

                })
            })
        }

        // Function to start the process, move the file
        //The function cb invoke the function readCsv but first check
        fs.rename(oldPath, newPath, cb)

    }

    search(req,res) {
        const val = req.params.val.toUpperCase();
        const querys = {
            query: {
                $or: [
                    {code: { $regex: val } },
                    {name: { $regex: val } }
                ]
            },
            limit: 50
        }

        mongo(db).find(querys, (err, data) => res.json(data))
    }


}

module.exports = new Items();