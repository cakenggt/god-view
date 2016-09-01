'use strict';

const credentials = require('./credentials');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const Sequelize = require('sequelize');
const db = new Sequelize(credentials.TEST_DATABASE_URL, {
  logging: false
});

//sync all models
db.sync();

const models = db.import(__dirname + '/models');

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

http.listen(credentials.PORT, function(){
  console.log('Example app listening on port', credentials.PORT, '!');
});

let apiOptions = {
  app: app,
  models: models
};
//Load the api versions
require('./api/v1')(apiOptions);

app.get('/', function(req, res){
  res.sendFile(__dirname+'/public/html/index.html');
});
