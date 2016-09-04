import React from 'react';

var Filters = React.createClass({
  render: function(){
    return (
      <div
        className="controls">
        <h2>Filters</h2>
        <Time
          className="control"
          setFilter={this.props.setFilter}
          filterKey="time"
          />
        <Day
          className="control"
          setFilter={this.props.setFilter}
          filterKey="day"
          />
      </div>
    );
  }
});

var Time = React.createClass({
  propTypes: {
    filterKey: React.PropTypes.string.isRequired
  },
  getInitialState: function(){
    return {
      timeMax: 23,
      timeMin: 0
    };
  },
  render: function(){
    return (
      <div
        className="control">
        <p>Hour of the Day Range (EST)</p>
        <input
          type="Number"
          onChange={this.timeMinChange}
          value={this.state.timeMin}
          className="hourInput"
          /> to <input
          type="Number"
          onChange={this.timeMaxChange}
          value={this.state.timeMax}
          className="hourInput"
          />
      </div>
    );
  },
  timeMinChange: function(e){
    var timeMin = parseFloat(e.target.value);
    this.setState({timeMin: timeMin});
    var newFilter = this.computeFilter({timeMin: timeMin});
    this.props.setFilter(this.props.filterKey, newFilter);
  },
  timeMaxChange: function(e){
    var timeMax = parseFloat(e.target.value);
    this.setState({timeMax: timeMax});
    var newFilter = this.computeFilter({timeMax: timeMax});
    this.props.setFilter(this.props.filterKey, newFilter);
  },
  computeFilter: function(options){
    var timeMin = this.state.timeMin;
    var timeMax = this.state.timeMax;
    if (options){
      timeMin = options.timeMin !== undefined ? options.timeMin : timeMin;
      timeMax = options.timeMax !== undefined ? options.timeMax : timeMax;
    }
    return function(val, index, array){
      var hours = val.time.hour();
      if (timeMin <= timeMax){
        return hours >= timeMin && hours <= timeMax;
      }
      else{
        return hours >= timeMin || hours <= timeMax;
      }
    };
  }
});

var Day = React.createClass({
  propTypes: {
    filterKey: React.PropTypes.string.isRequired
  },
  getInitialState: function(){
    return {
      dayMax: 7,
      dayMin: 1
    };
  },
  render: function(){
    var dayList = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    var days = dayList.map(function(val, i){
      return (
        <option
          value={i+1}
          key={i+1}>
          {val}
        </option>
      );
    })
    return (
      <div
        className="control">
        <p>Day of Week Range</p>
        <select
          value={this.state.dayMin}
          onChange={this.dayMinChange}
          className="dayInput"
          >
          {days}
        </select> to <select
          value={this.state.dayMax}
          onChange={this.dayMaxChange}
          className="dayInput"
          >
          {days}
        </select>
      </div>
    );
  },
  dayMinChange: function(e){
    var dayMin = parseInt(e.target.value);
    this.setState({dayMin: dayMin});
    var newFilter = this.computeFilter({dayMin: dayMin});
    this.props.setFilter(this.props.filterKey, newFilter);
  },
  dayMaxChange: function(e){
    var dayMax = parseInt(e.target.value);
    this.setState({dayMax: dayMax});
    var newFilter = this.computeFilter({dayMax: dayMax});
    this.props.setFilter(this.props.filterKey, newFilter);
  },
  computeFilter: function(options){
    var dayMin = this.state.dayMin;
    var dayMax = this.state.dayMax;
    if (options){
      dayMin = options.dayMin !== undefined ? options.dayMin : dayMin;
      dayMax = options.dayMax !== undefined ? options.dayMax : dayMax;
    }
    return function(val, index, array){
      var day = val.time.day();
      if (dayMin <= dayMax){
        return day >= dayMin && day <= dayMax;
      }
      else{
        return day >= dayMin || day <= dayMax;
      }
    };
  }
});

exports.Filters = Filters;
