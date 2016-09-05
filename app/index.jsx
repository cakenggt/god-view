import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import * as Network from './Network';
import {GoogleApiWrapper, Map} from 'google-maps-react';
import {Scrollbars} from 'react-custom-scrollbars';
import {Neighborhoods, Coords, MaxRows, Stats, HeatMap} from './Controls.jsx';
import {Time, Day} from './Filters.jsx';

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
      totalRows: 10000,
      dragging: false
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
            <Controls>
                <Neighborhoods
                  setPoly={this.setPoly}
                  addMapReady={this.addMapReady}
                  />
                <Coords
                  polyNodes={this.state.polyNodes.slice(0)}
                  setPoly={this.setPoly}
                  addMapReady={this.addMapReady}
                  />
                <MaxRows
                  maxRows={this.state.maxRows}
                  setMaxRows={this.setMaxRows}
                  totalRows={this.state.totalRows}
                  />
                <Stats
                  filteredTrips={this.state.filteredTrips}
                  />
                <HeatMap
                  filteredTrips={this.state.filteredTrips}
                  addMapReady={this.addMapReady}
                  />
            </Controls>
            <Filters>
              <Time
                className="control"
                setFilter={this.setFilter}
                filterKey="time"
                />
              <Day
                className="control"
                setFilter={this.setFilter}
                filterKey="day"
                />
            </Filters>
          </div>
        </Scrollbars>
      </div>
    );
  },
  /**
   * This function is provided to let any components which need the map or google
   * objects to run their specific functions when those become available.
   */
  addMapReady: function(fun){
    var onMapReady = this.state.onMapReady;
    onMapReady.push(fun);
    this.setState({onMapReady: onMapReady});
  },
  //This runs when the map object is obtained. It also means the google object exists
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

    //This goes through all the map ready functions and executes them
    var mapReadyFunctions = this.state.onMapReady;
    for (var f = 0; f < mapReadyFunctions.length; f++){
      var fun = mapReadyFunctions[f];
      fun.call(this, map);
    }

    var self = this;
    google.maps.event.addListener(polygon, 'dragstart', function(){
      self.setState({dragging: true});
    });
    google.maps.event.addListener(polygon, 'dragend', function(){
      var polyNodes = polygon.getPaths().getAt(0).getArray();
      self.setState({polyNodes: polyNodes, dragging: false});
      $('.button-selected').removeClass('button-selected');
      self.getTripsAndApplyFilters({polyNodes: polyNodes});
    });

    this.setState({
      map: map
    });
    polygon.setMap(map);
  },
  //This gets the network to make a request with the current polygon
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
  //This method applies the filters one by one
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
  /**
   * This method is provided to the filters so that they can provide their
   * own methods for the Array.filter function.
   */
  setFilter: function(key, filter){
    var filters = this.state.filters;
    filters[key] = filter;
    this.setState({filters: filters});
    this.applyFilters();
  },
  /**
   * This method not only sets the polygon coordinates, but also reapplies
   * the listeners to the polygon paths and gets new trip data from the server.
   */
  setPoly: function(polyNodes){
    $('.button-selected').removeClass('button-selected');
    this.setState({polyNodes: polyNodes});
    this.state.polygon.setPaths(polyNodes);

    //The listener is broken when the paths are reset, reset the listener here
    var self = this;
    //This prevents the set_at listener from firing when the polygon is dragged
    var polygonChangeListener = function(){
      if (self.state.dragging == false){
        $('.button-selected').removeClass('button-selected');
        var polyNodes = this.getArray();
        self.setState({polyNodes: polyNodes});
        self.getTripsAndApplyFilters({polyNodes: polyNodes});
      }
    }
    var path = this.state.polygon.getPath();
    google.maps.event.addListener(path, 'insert_at', polygonChangeListener);
    google.maps.event.addListener(path, 'remove_at', polygonChangeListener);
    google.maps.event.addListener(path, 'set_at', polygonChangeListener);

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

var Controls = React.createClass({
  render: function(){
    return (
      <div
        className="controls">
        <h2>Controls</h2>
        {this.props.children}
      </div>
    )
  }
});

var Filters = React.createClass({
  render: function(){
    return (
      <div
        className="controls">
        <h2>Filters</h2>
        {this.props.children}
      </div>
    );
  }
});

var WrappedContainer = GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['visualization']
})(Container);

render(
  <WrappedContainer/>,
  document.getElementById('app'));
