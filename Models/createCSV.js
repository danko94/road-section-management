const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ariel:ariel123@cluster0.oghpa.mongodb.net/ariel2?retryWrites=true&w=majority";
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");


async function getData(){
    await MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true },  async function(err, db) {
        if (err) throw err;
        var dbo = db.db("Project");
        data = await dbo.collection("test2").find().toArray();
        const json2csvParser = new Json2csvParser({ header: true });
        const csvData = json2csvParser.parse(data);
        fs.writeFile('./Models/Dataset.csv',csvData, function(error){
            if (error) throw error;
            console.log("CSV created");
            db.close()
        });
    });
}


module.exports.getData =  getData;