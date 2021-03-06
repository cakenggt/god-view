import moment from 'moment-timezone';

function getAll(component, points, numRows){
  var route = '/api/v1/trip';
  var linkedPoints = points.slice(0);
  //Linking the polygon back to its beginning
  linkedPoints.push(linkedPoints[0]);
  var geoJsonPoints = linkedPoints.map(function(point){
    return [point.lng(), point.lat()];
  });
  return $.ajax({
    url: route,
    type: 'GET',
    data: {
      numRows: numRows,
      polygon: JSON.stringify({
        "type": "Polygon",
        "coordinates": [
          geoJsonPoints
        ]
      })
    }
  })
  .then(function(response){
    if (response.trips){
      for (var t = 0; t < response.trips.length; t++){
        var trip = response.trips[t];
        trip.time = moment.tz(trip.time, 'America/New_York');
      }
      component.setState({
        trips: response.trips
      });
    }
    if (response.totalRows !== undefined){
      component.setState({
        totalRows: response.totalRows
      });
    }
  });
}

exports.getAll = getAll;
