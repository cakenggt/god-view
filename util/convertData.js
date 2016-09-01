var fs = require('fs');
var parse = require('csv-parse');
var Sequelize = require('sequelize');
var argv = require('yargs').argv;

var credentials = require('../credentials');

var db = new Sequelize(credentials.DATABASE_URL, {
  logging: false
});

//sync all models and erase previous data
db.sync({
  force: true
});

var models = db.import('../models');

var basePath = 'uber-tlc-foil-response/uber-trip-data/uber-raw-data-';

var limit = argv.records || 10000;
console.log(argv);

var rowNum = -1;
var result = [];
var files = [
  'sep14.csv',
  'aug14.csv',
  'jul14.csv',
  'jun14.csv',
  'may14.csv',
  'apr14.csv',
];
var estOffsetStr = ' -5:00';
var parser = parse();
parser.on('data', function(data){
  //skips the first line, and all lines after the limit
  if (rowNum === -1 || rowNum > limit*2-1){
    rowNum++;
    return;
  }
  if (rowNum%2){
    //add to end of last record
    var dropoff = {
      type: 'Point',
      coordinates: [
        parseFloat(data[2]),
        parseFloat(data[1])
      ]
    };
    var last = result[result.length-1];
    last.dropoff = dropoff;
  }
  else{
    //push new record
    var pickup = {
      type: 'Point',
      coordinates: [
        parseFloat(data[2]),
        parseFloat(data[1])
      ]
    };
    var time = new Date(data[0] + estOffsetStr);
    var record = {
      time: time,
      pickup: pickup,
      base: data[3]
    };
    result.push(record);
  }
  rowNum++;
});

function uploadFile(path){
  fs.createReadStream(basePath+path).pipe(parser)
  .on('finish', function(){
    if (files.length && result.length < limit){
      uploadFile(files.pop());
    }
    else{
      models.Trip.bulkCreate(result)
      .then(function(){
        console.log('Finished uploading', result.length, 'records!');
      });
    }
  });
}

uploadFile(files.pop());
