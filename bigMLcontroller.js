const pred = require('./Models/Prediction')
const fs = require('fs')
const express = require('express');
const app = express();
var server = require('http').createServer(app);
const Kafka = require("node-rdkafka");
const port = 3002
const io = require("socket.io")(server)
const modelMaker = require('./Models/makeModel')
const csvFile = require('./Models/createCSV'); 




var now = Math.floor(Date.now() / 1000);

var preds=[
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
];

var accuracy = 100
var totalSamples = 0
var correctPreds = 0

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
  
  const topic = `${prefix}confusion`;
    
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
   var data = JSON.parse(m.value.toString());
   console.log(m.value.toString())
  
   if (data['time'] > now){
        console.log('--_-_--_-_-_')
        prediction = getPred(data.cType, data.start_section, data.end_section, data.time, data.weekday, data.special, set_CM) // data.time, data.weekday, data.special 
  }});
  consumer.on("disconnected", function(arg) {
    process.exit();
  });
  consumer.on('event.error', function(err) {
    console.error(err);
    process.exit(1);
  });
  consumer.on('event.log', function(log) {
    //console.log(log);
  });

app.set('view engine', 'ejs');
app.get('/', (req, res) => res.send("<a href='/confusion_matrix' style='font-size: 50px;'>Confusion Matrix</a> <br/><a href='/GetPrediction' style='font-size: 50px;'>Predict</a>  <br/><a href='/create_new_model' style='font-size: 50px;'>Create a new model</a> <br/><a href='/create_new_dataset' style='font-size: 50px;'>Update Dataset</a>"));


app.get('/confusion_matrix', (req, res) => {    
    res.render('conMat',{predictions:preds, startEval: startEval, accuracy:accuracy});   
})

app.get('/create_new_model', (req, res) => {
    modelMaker.create_model()
    res.send('New model is being created, make sure to update dataset first')
})

app.get('/create_new_dataset', (req, res) => {
  csvFile.getData()
  res.send('Dataset is being updated')
})

app.get('/GetPrediction', (req, res) => {
    res.render('predict')       
  })

function startEval(){ // called when opening confusion matrix
    consumer.connect();    
}

io.on("connection", (socket) => {
    //console.log("new user connected");
    socket.on("prediction", (msg) => { 
        console.log('prediction')
        getPred(msg.cType, msg.start_section, 0, msg.time, msg.weekday, msg.special, set_pred) // 0 (end section not needed), data.time, data.weekday, data.special
     });
     socket.on("reset", () => {
       console.log("reset")
      preds=[
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ];
      accuracy = 100
      totalSamples = 0
      correctPreds = 0
     })
});


// load model from file and make a prediction
async function getPred(ctype, start_sec, end_sec, time, weekday, special, cb){
    console.log('predicting for ' + ctype + ", " + start_sec)
    fs.readFile('./Models/model.txt', function(error, model){
        if (error) console.log(error)
        var a = pred.getPrediction(model, ctype, start_sec, end_sec, time, weekday, special, cb)
        return a        
    })    
}
// callback for single prediction
function set_pred(a ,p){
    final_pred=p
    io.emit('hello', p)
}

// callback for confusion matrix
function set_CM(actual, predicted){
    totalSamples++
    if(actual==predicted){
        preds[actual-2][actual-2]++
        correctPreds++
    }
    else{
        console.log('expected: ' + actual + ', predicted: ' + predicted)
        preds[actual-2][predicted-2]++
    }
    accuracy = Math.round((correctPreds/totalSamples)*100)
}

server.listen(port, () => console.log(`Ariel app listening at http://localhost:${port}`));