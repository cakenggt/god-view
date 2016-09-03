import React from 'react';

var Filters = React.createClass({
  render: function(){
    return (
      <div>
        <h2>Filters</h2>
        <Base
          className="filter"
          setFilter={this.props.setFilter}
          filterKey="base"
          />
        <Time
          className="filter"
          setFilter={this.props.setFilter}
          filterKey="time"
          />
        <Day
          className="filter"
          setFilter={this.props.setFilter}
          filterKey="day"
          />
      </div>
    );
  }
});

var Base = React.createClass({
  propTypes: {
    filterKey: React.PropTypes.string.isRequired
  },
  getInitialState: function(){
    return {
      base: ''
    };
  },
  render: function(){
    return (
      <div
        className="control">
        <p
          className="lead">Base</p> &nbsp;
        <input
          value={this.state.base}
          onChange={this.changeBase}
          />
      </div>
    );
  },
  changeBase: function(e){
    var newBase = e.target.value;
    this.setState({base: newBase});
    var newFilter = this.computeFilter(newBase);
    this.props.setFilter(this.props.filterKey, newFilter);
  },
  computeFilter: function(base){
    if (!base){
      return function(){
        return true;
      }
    }
    else{
      return function(val, index, array){
        return val.base === base;
      }
    }
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
        <p
          className="lead">Time Range</p>
        <input
          type="Number"
          onChange={this.timeMinChange}
          value={this.state.timeMin}
          /><br/>
        to <br/>
        <input
          type="Number"
          onChange={this.timeMaxChange}
          value={this.state.timeMax}
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
      var hours = val.time.getHours();
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
        <p
          className="lead">Day Range</p>
        <select
          value={this.state.dayMin}
          onChange={this.dayMinChange}
          >
          {days}
        </select><br/>
        to <br/>
        <select
          value={this.state.dayMax}
          onChange={this.dayMaxChange}
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
      var day = val.time.getDay();
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
