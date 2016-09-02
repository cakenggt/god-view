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
        className="coords">
        Coords
        <br/>
        <textarea
          value={this.state.polyNodeStr}
          onChange={this.changeStr}
          rows={6}
          />
      </div>
    )
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
        className="maxRows">
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

exports.Controls = Controls;
