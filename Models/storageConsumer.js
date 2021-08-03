// https://www.cloudkarafka.com/

const Kafka = require("node-rdkafka");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ariel:ariel123@cluster0.oghpa.mongodb.net/ariel2?retryWrites=true&w=majority";

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "glider-01.srvs.cloudkafka.com:9094,glider-02.srvs.cloudkafka.com:9094,glider-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "ul43f4hz",
  "sasl.password": "EUP0BQ0-x2gNlC8BFvKtzcrz8Rw6Hdyz",
  "debug": "generic,broker,security"
};

const prefix = "ul43f4hz-";

const topic = `${prefix}storage`;


const topics = [topic];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  "auto.offset.reset": "beginning"
});

consumer.on("error", function(err) {
  console.error(err);
});
consumer.on("ready", function(arg) {
  console.log(`Consumer ${arg.name} ready`);
  consumer.subscribe(topics);
  consumer.consume();
});

consumer.on("data", function(m) {
 console.log(m.value.toString());
 MongoClient.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Project");
  var myobj = JSON.parse(m.value.toString());
  console.log(myobj); //for debug porpuse
  dbo.collection("test2").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

});
consumer.on("disconnected", function(arg) {
  process.exit();
});
consumer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});
consumer.on('event.log', function(log) {
  // console.log(log);
});

function conn(){
  consumer.connect();
}

module.exports.storage_connect = conn