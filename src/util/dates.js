'use strict';
var dateMath = require('date-arithmetic')
  , { 
    directions
  , calendarViewUnits } = require('./constants')
  , locale = require('./configuration').locale


var dates = module.exports = Object.assign(dateMath, {


  parse: function(date, format, culture) {
    return locale.date.parse(date, format, culture)
  },

  format: function(date, format, culture){
    return locale.date.format(date, format, culture)
  },
  
  monthsInYear: function(year){
    var months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      , date   = new Date(year, 0, 1)

    return  months.map( i => dates.month(date, i))
  },


  firstVisibleDay: function(date, culture){
    var firstOfMonth = dates.startOf(date, 'month')

    return dates.startOf(firstOfMonth, 'week', locale.date.startOfWeek(culture));
  },

  lastVisibleDay: function(date, culture){
    var endOfMonth = dates.endOf(date, 'month')

    return dates.endOf(endOfMonth, 'week', locale.date.startOfWeek(culture));
  },

  visibleDays: function(date, culture){
    var current = dates.firstVisibleDay(date, culture)
      , last = dates.lastVisibleDay(date, culture)
      , days = [];

    while( dates.lte(current, last, 'day') ) {
      days.push(current)
      current = dates.add(current, 1, 'day')
    }

    return days
  },

  move(date, min, max, unit, direction){
    var isMonth = unit === 'month'
      , isUpOrDown = direction === directions.UP || direction === directions.DOWN
      , rangeUnit = calendarViewUnits[unit]
      , addUnit = isMonth && isUpOrDown ? 'week' : calendarViewUnits[unit]
      , amount = isMonth || !isUpOrDown ? 1 : 4
      , newDate;

    if ( direction === directions.UP || direction === directions.LEFT)
      amount *= -1

    newDate = dates.add(date, amount, addUnit)

    return dates.inRange(newDate, min, max, rangeUnit) 
      ? newDate 
      : date
  },

  merge: function(date, time){
    if( time == null && date == null)
      return null

    if( time == null) time = new Date()
    if( date == null) date = new Date()

    date = dates.startOf(date, 'day')
    date = dates.hours(date,        dates.hours(time))
    date = dates.minutes(date,      dates.minutes(time))
    date = dates.seconds(date,      dates.seconds(time))
    return dates.milliseconds(date, dates.milliseconds(time))
  },

  sameMonth: function(dateA, dateB){
    return dates.eq(dateA, dateB, 'month')
  },

  today: function() {
    return this.startOf(new Date(), 'day')
  },

  yesterday: function() {
    return this.add(this.startOf(new Date(), 'day'), -1, 'day')
  },

  tomorrow: function() {
    return this.add(this.startOf(new Date(), 'day'), 1, 'day')
  }
})