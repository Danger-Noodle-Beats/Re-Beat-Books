const mongoose = require("mongoose");

// replace
const MONGO_URI = "mongodb+srv://shurlee:mongomango@recs.mvrkdfa.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "recs" })
        .then(() => console.log("Connected to Mongo DB."))
        .catch((err) => console.log(err));

const Schema = mongoose.Schema;


const RecSchema = new Schema ({
    book: { type: String, required: true},
    author: { type: String, required: true },
    artistName: { type: String, required: true },
    albumName: { type: String, required: true },
    albumArtURL: { type: String, required: true },
    spotifyURL: { type: String, required: true },
    albumURI: { type: String, required: true }
})

const Rec = mongoose.model('recs', RecSchema);





module.exports = { Rec };