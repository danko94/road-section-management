const bigml = require('bigml');
const fs = require('fs')

const csvFile = require('./createCSV'); 
const connection = new bigml.BigML('zohardaniel', '40c0877933a33d9d60c3cfb6bce112fb6396ca84');



async function create_model(){
  //await csvFile.getData()
  const source = new bigml.Source();
  var model_info;
  console.log('SOURCE STAGE')
  source.create('./Models/Dataset.csv', function(error, sourceInfo) {
    if (!error && sourceInfo) {
      var dataset = new bigml.Dataset();
      console.log('DATASET STAGE')
      dataset.create(sourceInfo, function(error, datasetInfo) {
        if (!error && datasetInfo) {
          var model = new bigml.Model();
          console.log('MODEL STAGE')
          model.create(datasetInfo, function (error, modelInfo) {
            if (!error && modelInfo) {
                model_info = modelInfo.resource;
                console.log(model_info + " Model INFO ");
                fs.writeFile('./Models/model.txt',model_info, function(error){
                  if (error) throw error;
                  console.log("model saved");
              });
            }
          });
        }
      });
    }
  });
  

 
}

module.exports.create_model = create_model
