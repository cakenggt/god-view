import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import * as Network from './Network';
import {GOOGLE_MAPS_API_KEY} from '../credentials';
import {GoogleApiWrapper, Map} from 'google-maps-react';

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
      },
      {
        lng:-73.991057,
        lat: 40.882309
      }
    ];
    return {
      trips: [],
      filteredTrips: [],
      polyNodes: polyNodes,
      polygon: null,
      map: null,
      filters: {}
    };
  },
  componentDidMount: function() {
    Network.getAll(this, this.state.polyNodes, 10000);
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
        <Map
          google={window.google}
          onReady={this.getMapReference}
          initialCenter={empireStateBuilding}
          zoom={11}
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
  }
});

var WrappedContainer = GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['visualization']
})(Container);

render(
  <WrappedContainer/>,
  document.getElementById('app'));
