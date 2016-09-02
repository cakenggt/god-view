import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import * as Network from './Network';
import {GOOGLE_MAPS_API_KEY} from '../credentials';
import {GoogleApiWrapper} from 'google-maps-react';

var Container = React.createClass({
  getInitialState: function() {
    return {
      trips: [],
      filteredTrips: [],
      polyNodes: [],
      map: null,
      filters: {}
    };
  },
  componentDidMount: function() {
    var points = [
      [-73.991057, 40.882309],
      [-73.598320, 40.940642],
      [-74.090263, 40.558339],
      [-73.991057, 40.882309]
    ];
    Network.getAll(this, points, 10000);
  },
  render: function() {
    return (
      <div>
        Done
        <div className="content">
          {React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              data: this.state,
              changeData: this.changeData,
              sort: this.sort
            });
          })}
        </div>
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
