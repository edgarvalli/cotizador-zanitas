const mongo = require("mongodb").MongoClient;
const mongoId = require("mongodb").ObjectID

module.exports = db => collection => {

    return {
        
        url: "mongodb://localhost:27017/" + db,

        id: id => mongoId(id),

        find: function({ query = {},select = {}, limit = 0, skip = 0 }, cb) {
            /*
            *   By default the parameters define itselft, if need change
            *   only change the parameters when you invoke the funcion
            */
            mongo.connect(this.url, (err, db) => {
                db.collection(collection).find(query, select).limit(limit).skip(skip).toArray(cb)
            })
        },

        findOne: function(query, cb) {
            mongo.connect(this.url, (err, db) => {
                db.collection(collection).findOne(query, cb)
            })
        },

        insert: function(data,cb) {
            mongo.connect(this.url, (err,db) => {
                db.collection(collection).insert(data,cb)
            })
        },

        insertMany: function(data, cb) {
            mongo.connect(this.url, (err, db) => {
                db.collection(collection).insertMany(data, cb)
            })
        },

        update: function(query,data, cb) {
            mongo.connect(this.url, (err, db) => {
                db.collection(collection).update(query, data, cb)
            })
        },

        remove: function(query,cb) {
            mongo.connect(this.url, (err,db) => {
                db.collection(collection).remove(query,cb)
            })
        }

    }

}
