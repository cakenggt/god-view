import React from 'react';

//This filter filters out rides by hour
export var Time = React.createClass({
  propTypes: {
    filterKey: React.PropTypes.string.isRequired,
    setFilter: React.PropTypes.func.isRequired
  },
  getInitialState: function(){
    return {
      timeMax: 23,
      timeMin: 0
    };
  },
  render: function(){
    var timeLabels = [
      '12:00 AM','1:00 AM','2:00 AM','3:00 AM',
      '4:00 AM','5:00 AM','6:00 AM','7:00 AM','8:00 AM',
      '9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM',
      '2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM',
      '7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM'
    ];
    var times = timeLabels.map(function(time, i){
      return (
        <option
          value={i}
          key={i}>
          {time}
        </option>
      );
    });
    return (
      <div
        className="control">
        <p>Hour of the Day Range (EST)
          <i
            className="material-icons md-18"
            data-ot="Filters for trips between the provided 24-hour format hours for all days.
            Inputting a later start hour than end hour will filter across day boundaries.
            The hours will be interpreted in EST.">help_outline</i>
        </p>
        <select
          onChange={this.timeMinChange}
          value={this.state.timeMin}
          className="hourInput">
          {times}
        </select> to <select
          type="Number"
          onChange={this.timeMaxChange}
          value={this.state.timeMax}
          className="hourInput">
          {times}
        </select>
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

//This filter filters out rides by day of week
export var Day = React.createClass({
  propTypes: {
    filterKey: React.PropTypes.string.isRequired,
    setFilter: React.PropTypes.func.isRequired
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
        <p>Day of Week Range
          <i
            className="material-icons md-18"
            data-ot="Filters for trips between the provided days for all weeks.
            Inputting a later start day than end day will filter across week boundaries.
            The days will have their starts and stops interpreted in EST.">help_outline</i>
        </p>
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
