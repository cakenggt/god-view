import React from 'react';
import moment from 'moment-timezone';

var filteredTripsPropType = React.PropTypes.arrayOf(
  React.PropTypes.shape({
    base: React.PropTypes.string,
    dropoff: React.PropTypes.shape({
      type: React.PropTypes.string,
      coordinates: React.PropTypes.arrayOf(React.PropTypes.number)
    }),
    pickup: React.PropTypes.shape({
      type: React.PropTypes.string,
      coordinates: React.PropTypes.arrayOf(React.PropTypes.number)
    }),
    time: React.PropTypes.instanceOf(moment)
  })
);

export var Coords = React.createClass({
  propTypes: {
    addMapReady: React.PropTypes.func.isRequired,
    polyNodes: React.PropTypes.array.isRequired,
    setPoly: React.PropTypes.func.isRequired
  },
  getInitialState: function(){
    var polyNodes = this.props.polyNodes;
    return {
      polyNodeStr: this.polyNodesToStr(polyNodes),
      initialPolyNodes: []
    };
  },
  componentDidMount: function(){
    var self = this;
    //When the map is ready, add poly nodes
    this.props.addMapReady(function(map){
      var polyNodes = [
        new google.maps.LatLng(
          40.771119350177294,
          -73.99105700000001
        ),
        new google.maps.LatLng(
          40.758332954417135,
          -73.96498870117188
        ),
        new google.maps.LatLng(
          40.736514041613354,
          -74.00237237500005
        )
      ];
      self.setState({initialPolyNodes: polyNodes});
      this.setPoly(polyNodes);
    });
  },
  polyNodesToStr: function(polyNodes){
    var polyNodeStr = '';
    for (var p = 0; p < polyNodes.length; p++){
      var polyNode = polyNodes[p];
      polyNodeStr += polyNode.lat() + ' ' + polyNode.lng() + '\n';
    }
    polyNodeStr = polyNodeStr.substring(0, polyNodeStr.length-1);
    return polyNodeStr;
  },
  componentWillReceiveProps: function(newProps){
    //Checks to see if a change to the polygon was done, and if so, reset the text
    var newPolyNodeStr = this.polyNodesToStr(newProps.polyNodes);
    var oldPolyNodeStr = this.polyNodesToStr(this.props.polyNodes);
    if (oldPolyNodeStr !== newPolyNodeStr){
      this.setState({polyNodeStr: newPolyNodeStr});
    }
  },
  render: function(){
    return (
      <div
        className="control">
        <p>Polygon Coordinates
          <span
            className="resetBtn"
            onClick={this.reset}>Reset</span>
        </p>

        <textarea
          value={this.state.polyNodeStr}
          onChange={this.changeStr}
          rows={6}
          className="polyNodeInput"
          />
      </div>
    )
  },
  reset: function(){
    this.setPoly(this.state.initialPolyNodes);
  },
  changeStr: function(e){
    var polyNodeStr = e.target.value;
    this.setState({polyNodeStr: polyNodeStr});
    this.setStatePolyNodes(polyNodeStr);
  },
  setStatePolyNodes: function(polyNodeStr){
    var newPolyNodes = [];
    var lines = polyNodeStr.split('\n');
    for (var l = 0; l < lines.length; l++){
      var line = lines[l];
      var parts = line.split(' ');
      if (parts.length == 2){
        var lat = parseFloat(parts[0]);
        var lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)){
          newPolyNodes.push(new google.maps.LatLng(
            lat,
            lng
          ));
        }
        else{
          return;
        }
      }
      else{
        return;
      }
    }
    this.setState({polyNodes: newPolyNodes});
    if (newPolyNodes.length > 2){
      this.setPoly(newPolyNodes);
    }
  },
  setPoly: function(polyNodes){
    this.props.setPoly(polyNodes);
  }
});

export var MaxRows = React.createClass({
  propTypes: {
    maxRows: React.PropTypes.number.isRequired,
    setMaxRows: React.PropTypes.func.isRequired,
    totalRows: React.PropTypes.number.isRequired
  },
  getInitialState: function(){
    return {
      maxRows: this.props.maxRows
    };
  },
  render: function(){
    return (
      <div
        className="control maxRows">
        <p>Maximum Shown Trips</p>
        <input
          type="Number"
          value={this.state.maxRows}
          onChange={this.setMaxRows}
          className="rowNumInput"
          min={0}
          max={this.props.totalRows}
          />
      </div>
    );
  },
  setMaxRows: function(e){
    var maxRows = parseInt(e.target.value);
    if (!isNaN(maxRows)){
      this.setState({maxRows: maxRows});
      this.props.setMaxRows(maxRows);
    }
  }
});

export var Stats = React.createClass({
  propTypes: {
    filteredTrips: filteredTripsPropType
  },
  render: function(){
    var trips = this.props.filteredTrips;
    var earliestDate = null;
    var latestDate = null;
    for (var t = 0; t < trips.length; t++){
      var trip = trips[t];
      if (earliestDate === null || trip.time.isBefore(earliestDate)){
        earliestDate = trip.time;
      }
      if (latestDate === null || trip.time.isAfter(latestDate)){
        latestDate = trip.time;
      }
    }
    var dateString = '';
    if (earliestDate){
      dateString = `Earliest Trip: ${earliestDate.format("YYYY/MM/DD")}
Latest Trip: ${latestDate.format("YYYY/MM/DD")}`
    }
    return (
      <div
        className="control stats">
        <p>Statistics</p>
        <pre>
          Number of trips: {trips.length}<br/>
          {dateString}
        </pre>
      </div>
    );
  }
});

export var HeatMap = React.createClass({
  propTypes: {
    addMapReady: React.PropTypes.func.isRequired,
    filteredTrips: filteredTripsPropType
  },
  getInitialState: function(){
    return {
      pickup: false,
      dropoff: false,
      heatMap: null
    }
  },
  componentDidMount: function(){
    var self = this;
    this.props.addMapReady(function(map){
      var heatMap = new google.maps.visualization.HeatmapLayer({
        data: []
      });
      self.setState({heatMap: heatMap});
      heatMap.setMap(map);
    });
  },
  componentWillReceiveProps: function(nextProps){
    if (this.state.heatMap){
      this.computeHeatmap(nextProps.filteredTrips);
    }
  },
  render: function(){
    return (
      <div
        className="control">
        <p>Heat Map</p>
        <label
          className="heatMapLabel">
          <input
            type="checkbox"
            checked={this.state.pickup}
            onChange={this.checkPickup}
            className="heatMapCheck"
            />
          Pickup
        </label>
        <label
          className="heatMapLabel">
          <input
            type="checkbox"
            checked={this.state.dropoff}
            onChange={this.checkDropoff}
            className="heatMapCheck"
            />
            Dropoff
        </label>
      </div>
    )
  },
  checkDropoff: function(e){
    this.setState({dropoff: e.target.checked});
    this.computeHeatmap(this.props.filteredTrips, {dropoff: e.target.checked});
  },
  checkPickup: function(e){
    this.setState({pickup: e.target.checked});
    this.computeHeatmap(this.props.filteredTrips, {pickup: e.target.checked});
  },
  computeHeatmap: function(filteredTrips, options){
    var heatMap = this.state.heatMap;
    var newData = [];
    var hasPickup = this.state.pickup;
    var hasDropoff = this.state.dropoff;
    if (options){
      hasPickup = options.pickup !== undefined ? options.pickup : hasPickup;
      hasDropoff = options.dropoff !== undefined ? options.dropoff : hasDropoff;
    }
    for (var i = 0; i < filteredTrips.length; i++){
      var trip = filteredTrips[i];
      if (hasPickup){
        newData.push(new google.maps.LatLng(
          trip.pickup.coordinates[1],
          trip.pickup.coordinates[0]
        ));
      }
      if (hasDropoff){
        newData.push(new google.maps.LatLng(
          trip.dropoff.coordinates[1],
          trip.dropoff.coordinates[0]
        ));
      }
    }
    heatMap.setData(newData);
  }
});
