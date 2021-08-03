const uuid = require("uuid");
const Kafka = require("node-rdkafka");

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
const topic_RT = `${prefix}RT`;
const topic_storage = `${prefix}storage`;
const topic_confusion = `${prefix}confusion`;
const producer = new Kafka.Producer(kafkaConf);

const genMessage = m => new Buffer.alloc(m.length,m);

producer.on("ready", function(arg) {
  console.log(`producer Ariel is ready.`);
});
producer.connect();

module.exports.publish= function(msg)
{   
  m = JSON.stringify(msg);
  
  if(msg.hasOwnProperty('end_section')){
    console.log(m + ' for storage')
    producer.produce(topic_storage, -1, genMessage(m), uuid.v4());
    producer.produce(topic_confusion, -1, genMessage(m), uuid.v4());
  }
  else{
    console.log(m + ' for RT')
    producer.produce(topic_RT, -1, genMessage(m), uuid.v4());
  } 
  //producer.disconnect();   
}