'use strict';

let crypto = require('crypto');

class TripManager {
  constructor(models){
    this.models = models;
  }

  /**
   * Polygon is a geoJson. It is already in lon lat form.
   */
  getTripsWithinPolygon(polygonJsonString, numRows){
    let self = this;
    return this.models.Trip.findAll({
      where: self.models.sequelize.and(
        self.models.sequelize.fn(
          'ST_COVERS',
          self.models.sequelize.cast(
            self.models.sequelize.fn(
              'ST_GEOMFROMGEOJSON',
              polygonJsonString
            ),
            'geography'
          ),
          self.models.sequelize.col('pickup')
        ),
        self.models.sequelize.fn(
          'ST_COVERS',
          self.models.sequelize.cast(
            self.models.sequelize.fn(
              'ST_GEOMFROMGEOJSON',
              polygonJsonString
            ),
            'geography'
          ),
          self.models.sequelize.col('dropoff')
        )
      ),
      limit: numRows
    });
  }
}

module.exports = function(models){
  return new TripManager(models);
};
