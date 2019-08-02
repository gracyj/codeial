// linking our MongoDB using mongoose
const mongoose = require("mongoose");
const env = require("./environment");

// mongoose.connect("mongodb://localhost/codeial_development");
mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;
db.on("error",console.error.bind(console,"error connecting to MongoDB"));

db.once("open",function(){
    console.log("connected to Database :: MongoDB");
});

module.exports= db;