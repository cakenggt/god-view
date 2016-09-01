'use strict';
/*jshint expr: true*/
/*jslint mocha: true*/

let credentials = require('./credentials');
const Sequelize = require('sequelize');
const db = new Sequelize(credentials.DATABASE_URL, {
  logging: true
});
const models = db.import(__dirname + '/models');

var expect = require('chai').expect;
const tripManager = require('./manager/tripManager')(models);

describe('tripManager', function(){
  it('far away polygon', function(){
    return tripManager.getTripsWithinPolygon(JSON.stringify({
      "type": "Polygon",
      "coordinates": [
        [
          [-71.1776585052917, 42.3902909739571],
          [-71.1776820268866, 42.3903701743239],
          [-71.1776063012595, 42.3903825660754],
          [-71.1775826583081, 42.3903033653531],
          [-71.1776585052917, 42.3902909739571]
        ]
      ]
    }))
    .then(function(result){
      expect(result).to.be.empty;
    });
  });
  it('enclosing NY polygon', function(){
    return tripManager.getTripsWithinPolygon(JSON.stringify({
      "type": "Polygon",
      "coordinates": [
        [
          [-73.991057, 40.882309],
          [-73.598320, 40.940642],
          [-74.090263, 40.558339],
          [-73.991057, 40.882309]
        ]
      ]
    }))
    .then(function(result){
      expect(result).to.not.be.empty;
    });
  });
});
