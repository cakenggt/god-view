function getAll(component, points, numRows){
  var route = '/api/v1/trip';
  var linkedPoints = points.slice(0);
  //Linking the polygon back to its beginning
  linkedPoints.push(linkedPoints[0]);
  var geoJsonPoints = linkedPoints.map(function(point){
    return [point.lng, point.lat];
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
        trip.time = new Date(trip.time);
      }
      //TODO filter them now
      component.setState({
        trips: response.trips
      });
    }
  });
}

exports.getAll = getAll;
