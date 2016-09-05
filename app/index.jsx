import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import * as Network from './Network';
import {GOOGLE_MAPS_API_KEY} from '../credentials';
import {GoogleApiWrapper, Map} from 'google-maps-react';
import {Scrollbars} from 'react-custom-scrollbars';
import {Controls} from './Controls.jsx';
import {Filters} from './Filters.jsx';

var Container = React.createClass({
  getInitialState: function() {
    return {
      trips: [],
      filteredTrips: [],
      polyNodes: [],
      polygon: null,
      map: null,
      filters: {},
      maxRows: 10000,
      onMapReady: [],
      totalRows: 10000
    };
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
          className="right-pane"
          >
          <Map
            google={window.google}
            onReady={this.getMapReference}
            initialCenter={empireStateBuilding}
            zoom={11}
            />
        </div>
        <Scrollbars
          className="left-pane"
          style={{width:'20%'}}>
          <div
            className="left-pane-contents">
            <Controls
              filteredTrips={this.state.filteredTrips}
              polyNodes={this.state.polyNodes.slice(0)}
              maxRows={this.state.maxRows}
              setPoly={this.setPoly}
              setMaxRows={this.setMaxRows}
              map={this.state.map}
              addMapReady={this.addMapReady}
              totalRows={this.state.totalRows}
              />
            <Filters
              setFilter={this.setFilter}
              />
          </div>
        </Scrollbars>
      </div>
    );
  },
  addMapReady: function(fun){
    var onMapReady = this.state.onMapReady;
    onMapReady.push(fun);
    this.setState({onMapReady: onMapReady});
  },
  getMapReference: function(mapProps, map){
    var polygon = new window.google.maps.Polygon({
      paths: [],
      strokeColor: '#0000FF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#0000FF',
      fillOpacity: 0.35,
      editable: true,
      draggable: true
    });

    this.setState({polygon: polygon});

    var mapReadyFunctions = this.state.onMapReady;
    for (var f = 0; f < mapReadyFunctions.length; f++){
      var fun = mapReadyFunctions[f];
      fun.call(this, map);
    }

    var self = this;
    //This prevents the set_at listener from firing when the polygon is dragged
    var polygonEventObject = {dragging: false};
    var polygonChangeListener = function(){
      if (polygonEventObject.dragging == false){
        var polyNodes = this.getArray();
        self.setState({polyNodes: polyNodes});
        self.getTripsAndApplyFilters({polyNodes: polyNodes});
      }
    }
    var path = polygon.getPath();
    google.maps.event.addListener(path, 'insert_at', polygonChangeListener);
    google.maps.event.addListener(path, 'remove_at', polygonChangeListener);
    google.maps.event.addListener(path, 'set_at', polygonChangeListener);
    google.maps.event.addListener(polygon, 'dragstart', function(){
      polygonEventObject.dragging = true;
    });
    google.maps.event.addListener(polygon, 'dragend', function(){
      var polyNodes = polygon.getPaths().getAt(0).getArray();
      self.setState({polyNodes: polyNodes});
      polygonEventObject.dragging = false;
      self.getTripsAndApplyFilters({polyNodes: polyNodes});
    });

    this.setState({
      map: map
    });
    polygon.setMap(map);
  },
  getTripsAndApplyFilters(options){
    var maxRows = this.state.maxRows;
    var polyNodes = this.state.polyNodes;
    if (options){
      maxRows = options.maxRows !== undefined ? options.maxRows : maxRows;
      polyNodes = options.polyNodes !== undefined ? options.polyNodes : polyNodes;
    }
    Network.getAll(this, polyNodes, maxRows)
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
  setFilter: function(key, filter){
    var filters = this.state.filters;
    filters[key] = filter;
    this.setState({filters: filters});
    this.applyFilters();
  },
  setPoly: function(polyNodes){
    this.setState({polyNodes: polyNodes});
    this.state.polygon.setPaths(polyNodes);
    this.getTripsAndApplyFilters({
      polyNodes: polyNodes
    });
  },
  setMaxRows: function(maxRows){
    this.setState({maxRows: maxRows});
    this.getTripsAndApplyFilters({
      maxRows: maxRows
    });
  }
});

var WrappedContainer = GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['visualization']
})(Container);

render(
  <WrappedContainer/>,
  document.getElementById('app'));
