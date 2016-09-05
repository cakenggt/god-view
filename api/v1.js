'use strict';

const prefix = '/api/v1/';

module.exports = function(options){

  let app = options.app;
  let models = options.models;
  let tripManager = require('../manager/tripManager')(models);

  app.get(prefix+'trip', function(req, res){
    var numRows = req.query.numRows !== undefined ?
      parseInt(req.query.numRows) : 10000;
    Promise.all([
      tripManager.getTripsWithinPolygon(req.query.polygon, numRows),
      models.Trip.count()
    ])
    .then(function(results){
      let json = {
        trips: [],
        totalRows: results[1]
      };
      for (var r = 0; r < results[0].length; r++){
        let result = results[0][r];
        json.trips.push(result.get({
          plain: true
        }));
      }
      res.json(json);
      res.end();
    });
  });
};
