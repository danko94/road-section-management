const express = require('express');
const app = express();
const port = 3003
var server = require('http').createServer(app);

var redis = require('redis');
var redisClient = redis.createClient();
var sub = redis.createClient();

// kafka producers
const kafka = require('./Models/kafkaProduce');
// consumers
const storageCons = require('./Models/storageConsumer')
const RTCons = require('./Models/RTconsumer')
// body parser
const bodyParser = require('body-parser');

// connect consumers
storageCons.storage_connect()
RTCons.RT_connect()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// routes messages from simulator to Kafka
app.post('/', function (req, res) {
    console.log(req.body);
    kafka.publish(req.body) 
    res.send('OK');
  });
  
  var cars_on_road = 0;
  redisClient.get('NumOfCars', function(err, reply){
      cars_on_road = parseInt(reply)
      console.log('COR ' + cars_on_road) 
  })
  
  var sections = [0,0,0,0,0]
  var car_types = [0,0,0]
  var icons = ['<i class="fas fa-equals"></i>','<i class="fas fa-truck"></i>','<i class="fas fa-shuttle-van"></i>' ,'<i class="fas fa-car"></i>' ]
  
  app.use(express.static('public'))
 
  app.set('view engine', 'ejs')
  
  app.get('/dashboard', (req, res) => {
      var cards=[{'title':'Total Vehicles', 'num':cars_on_road,'icon': icons[0]},{'title':'Trucks', 'num':car_types[0],'icon': icons[1]},{'title':'Vans', 'num':car_types[1],'icon': icons[2]},{'title':'Private', 'num':car_types[2],'icon': icons[3]}];
      res.render("./pages/index",{cards:cards, sections:sections, total:cars_on_road});
  })
  
  sub.subscribe("message"); 
  
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      //next(err);
  });
  
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: {}
      });
  });
  
  
  sub.on("message", function (channel, data) {
    
    console.log('msg rcvd')
   
    redisClient.get('NumOfCars',function(err, reply){
        cars_on_road = parseInt(reply)     
    })
    
    redisClient.get("1", function (err, reply){
        sections[0] = parseInt(reply)    
    })
    redisClient.get("2", function (err, reply){
        sections[1] = parseInt(reply)      
    })
    redisClient.get("3", function (err, reply){
        sections[2] = parseInt(reply)      
    })
    redisClient.get("4", function (err, reply){
        sections[3] = parseInt(reply)     
    })
    redisClient.get("5", function (err, reply){
        sections[4] = parseInt(reply)      
    })
    
    redisClient.get("Truck", function (err, reply){
        car_types[0] = parseInt(reply)  
    })
    redisClient.get("Van", function (err, reply){
        car_types[1] = parseInt(reply)  
    })
    redisClient.get("Private", function (err, reply){
        car_types[2] = parseInt(reply)  
    })
})

server.listen(port, () => console.log(`app listening at http://localhost:${port}`));
