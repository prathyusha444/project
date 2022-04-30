
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;
mongoClient.connect("mongodb://localhost:27017", {
    useUnifiedTopology: true
}, function (error, client) {
    var database = client.db("project_1");
    console.log("Database connected.");
});