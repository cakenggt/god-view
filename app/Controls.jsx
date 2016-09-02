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
      polyNodeStr: polyNodeStr
    };
  },
  render: function(){
    return (
      <div>
        <textarea
          value={this.state.polyNodeStr}
          onChange={this.changeStr}
          rows={6}
          />
        <br/>
        <button
          onClick={this.setPoly}
        >
          Change Polygon
        </button>
      </div>
    )
  },
  changeStr: function(e){
    var polyNodeStr = e.target.value;
    this.setState({polyNodeStr: polyNodeStr});
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
  },
  setPoly: function(){
    this.props.setPoly(this.state.polyNodes);
  }
});

exports.Controls = Controls;
