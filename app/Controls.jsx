import React from 'react';

var Controls = React.createClass({
  getInitialState: function(){
    return {
      filteredTrips: this.props.filteredTrips,
      polyNodes: this.props.polyNodes,
      maxRows: this.props.maxRows
    };
  },
  render: function(){
    return (
      <div>
        <Coords
          polyNodes={this.state.polyNodes}
          setPoly={this.props.setPoly}
          map={this.props.map}
          />
        <MaxRows
          maxRows={this.props.maxRows}
          setMaxRows={this.props.setMaxRows}
          />
        <Stats
          filteredTrips={this.props.filteredTrips}
          />
        <HeatMap
          filteredTrips={this.props.filteredTrips}
          heatMap={this.props.heatMap}
          />
      </div>
    )
  }
});

var Coords = React.createClass({
  getInitialState: function(){
    var polyNodes = this.props.polyNodes;
    var polyNodeStr = '';
    for (var p = 0; p < polyNodes.length; p++){
      var polyNode = polyNodes[p];
      polyNodeStr += polyNode.lat + ' ' + polyNode.lng + '\n';
    }
    polyNodeStr = polyNodeStr.substring(0, polyNodeStr.length-1);
    return {
      polyNodes: polyNodes,
      polyNodeStr: polyNodeStr,
      google: null
    };
  },
  componentWillReceiveProps: function(nextProps){
    if ((!this.state.google || !this.props.map) &&
        (window.google && nextProps.map)){
      this.setState({google: window.google});
      var self = this;
      window.google.maps.event.addListener(nextProps.map, 'click', function(event) {
        var polyNodeStr = self.state.polyNodeStr;
        polyNodeStr += '\n'+event.latLng.lat()+' '+event.latLng.lng();
        polyNodeStr = polyNodeStr.trim();
        self.setState({polyNodeStr: polyNodeStr});
        self.setStatePolyNodes(polyNodeStr);
      });
    }
  },
  render: function(){
    return (
      <div
        className="control coords">
        Coords
        <span
          className="clear-btn"
          onClick={this.clear}>
          Clear
        </span>
        <br/>
        <textarea
          value={this.state.polyNodeStr}
          onChange={this.changeStr}
          rows={6}
          />
      </div>
    )
  },
  clear: function(){
    this.setState({polyNodeStr: ''});
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
          newPolyNodes.push({
            lat: lat,
            lng: lng
          });
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

var MaxRows = React.createClass({
  getInitialState: function(){
    return {
      maxRows: this.props.maxRows
    };
  },
  render: function(){
    return (
      <div
        className="control maxRows">
        Max Rows &nbsp;
        <input
          type="Number"
          value={this.state.maxRows}
          onChange={this.setMaxRows}
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

var Stats = React.createClass({
  render: function(){
    var trips = this.props.filteredTrips;
    return (
      <div
        className="control stats">
        <pre>
          Number of trips: {trips.length}
        </pre>
      </div>
    );
  }
});

var HeatMap = React.createClass({
  getInitialState: function(){
    return {
      pickup: false,
      dropoff: false
    }
  },
  componentWillReceiveProps: function(nextProps){
    if (this.props.heatMap){
      //recompute the heatmap with new filteredTrips
      this.computeHeatmap(nextProps.filteredTrips);
    }
  },
  render: function(){
    return (
      <div
        className="control">
        <input
          type="checkbox"
          checked={this.state.pickup}
          onChange={this.checkPickup}
          />
        Pickup &nbsp;
        <input
          type="checkbox"
          checked={this.state.dropoff}
          onChange={this.checkDropoff}
          />
          Dropoff
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
    var heatMap = this.props.heatMap;
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

exports.Controls = Controls;
