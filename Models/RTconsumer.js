// https://www.cloudkarafka.com/

const { json } = require("body-parser");
const Kafka = require("node-rdkafka");
var redis = require('redis');
var redisClient = redis.createClient();


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
const topic = `${prefix}RT`;

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
  console.log('-=-=-+-=-=-=-=-=-==-0=-90-90-=80=7=-6=8=9-96=8=-0=-=0');
  var json_data = JSON.parse(m.value.toString())
  var event = json_data.event
  var section = json_data.section
  var car_type = json_data.cType

  if (event=='enter_road'){
    redisClient.incr('NumOfCars')
    redisClient.incr(section)
    redisClient.incr(car_type)
  }
  else if(event=='exit_road'){
    redisClient.decr('NumOfCars')
    redisClient.decr(section-1)
    redisClient.decr(car_type)
  }
  else if(event=='enter_section'){
    redisClient.incr(section)
    redisClient.decr(section-1)
  }
  
  redisClient.hmset(JSON.parse(m.value.toString())['id'].toString(),JSON.parse(m.value.toString()), function (err, reply) {
    console.log(reply);
    redisClient.publish("message", m.value.toString());
    redisClient.EXPIRE(JSON.parse(m.value.toString())['id'].toString(), 60)
  });

});

// simulator -> prod -> RT -> redis - msg queue

// simulator -> prod -> RT -> update numOfCars 

// dashboard -> redis -> get NOC/section/cartypes

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

module.exports.RT_connect = conn