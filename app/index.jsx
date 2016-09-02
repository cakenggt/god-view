import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import * as Network from './Network';
import {GOOGLE_MAPS_API_KEY} from '../credentials';
import {GoogleApiWrapper, Map} from 'google-maps-react';
import {Controls} from './Controls.jsx';

var Container = React.createClass({
  getInitialState: function() {
    var polyNodes = [
      {
        lng:-73.991057,
        lat: 40.882309
      },
      {
        lng:-73.598320,
        lat: 40.940642
      },
      {
        lng:-74.090263,
        lat: 40.558339
      }
    ];
    return {
      trips: [],
      filteredTrips: [],
      polyNodes: polyNodes,
      polygon: null,
      map: null,
      filters: {},
      maxRows: 10000
    };
  },
  componentDidMount: function() {
    this.getTripsAndApplyFilters();
  },
  render: function() {
    const style = {
      width: '100%',
      height: '100%'
    };
    const empireStateBuilding = {
      lat: 40.748817,
      lng: -73.985428
    };
    return (
      <div style={style}>
        <div
          style={{width:'80%',height:'100%',float:'right'}}
          >
          <Map
            google={window.google}
            onReady={this.getMapReference}
            initialCenter={empireStateBuilding}
            zoom={11}
            />
        </div>
        <Controls
          filteredTrips={this.state.filteredTrips}
          polyNodes={this.state.polyNodes}
          maxRows={this.state.maxRows}
          setPoly={this.setPoly}
          />
      </div>
    );
  },
  getMapReference: function(mapProps, map){
    var polygon = new window.google.maps.Polygon({
      paths: this.state.polyNodes,
      strokeColor: '#0000FF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#0000FF',
      fillOpacity: 0.35
    });
    this.setState({
      polygon: polygon,
      map: map
    });
    polygon.setMap(map);
  },
  getTripsAndApplyFilters(){
    Network.getAll(this, this.state.polyNodes, this.state.maxRows)
    .then(this.applyFilters);
  },
  applyFilters: function(){
    var filterKeys = Object.keys(this.state.filters);
    var filteredTrips = this.state.trips.filter(function(val, index, array){
      for (var k = 0; k < filterKeys.length; k++){
        var keep = this.state.filters[filterKeys[k]](val, index, array);
        if (!keep){
          return false;
        }
      }
      return true;
    }, this);
    this.setState({filteredTrips: filteredTrips});
  },
  setPoly: function(polyNodes){
    this.setState({polyNodes: polyNodes});
    this.state.polygon.setPaths(polyNodes);
    this.getTripsAndApplyFilters();
  }
});

var WrappedContainer = GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['visualization']
})(Container);

render(
  <WrappedContainer/>,
  document.getElementById('app'));
