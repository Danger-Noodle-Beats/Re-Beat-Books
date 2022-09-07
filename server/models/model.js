const mongoose = require("mongoose");

// replace
const MONGO_URI = "mongodb+srv://shurlee:mongomango@goals.kt84zbf.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "goals" })
        .then(() => console.log("Connected to Mongo DB."))
        .catch((err) => console.log(err));

const Schema = mongoose.Schema;


const RecSchema = new Schema ({
    // TBD
})

















module.exports = {

};