'use strict';

const prefix = '/api/v1/';

module.exports = function(options){

  let app = options.app;
  let models = options.models;
  let tripManager = require('../manager/tripManager')(models);

  app.get(prefix+'trip', function(req, res){
    tripManager.getTripsWithinPolygon(req.query.polygon)
    .then(function(results){
      let json = {
        trips: []
      };
      for (var r = 0; r < results.length; r++){
        let result = results[r];
        json.trips.push(result.get({
          plain: true
        }));
      }
      res.json(json);
      res.end();
    });
  });
};
