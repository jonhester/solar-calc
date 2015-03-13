'use strict';

var Sun = require('./lib/sun.js');
var Moon = require('./lib/moon.js');

const degreesBelowHorizon = {
  sunrise: 0.833,
  sunriseEnd: 0.3,
  twilight: 6,
  nauticalTwilight: 12,
  night: 18,
  goldenHour: -6
};

class SolarCalc {
  constructor(date, lat, long) {
    this.date = date;
    this.lat = lat;
    this.long = long;

    // this.julianDate = getJD(date);

    this.sun = new Sun(date, lat, long);
    this.moon = new Moon(date, lat, long);
  }

  get solarNoon() {
    return this.sun.solarNoon;
  }

  get sunrise() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunrise, true);
  }

  get sunset() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunrise);
  }

  get sunriseEnd() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunriseEnd, true);
  }

  get sunsetStart() {
    return this.sun.timeAtAngle(degreesBelowHorizon.sunriseEnd, false);
  }

  get dawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.twilight, true);
  }

  get dusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.twilight, false);
  }

  get nauticalDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.nauticalTwilight, true);
  }

  get nauticalDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.nauticalTwilight, false);
  }

  get nightStart() {
    return this.sun.timeAtAngle(degreesBelowHorizon.night, false);
  }

  get nightEnd() {
    return this.sun.timeAtAngle(degreesBelowHorizon.night, true);
  }

  get goldenHourStart() {
    return this.sun.timeAtAngle(degreesBelowHorizon.goldenHour, false);
  }

  get goldenHourEnd() {
    return this.sun.timeAtAngle(degreesBelowHorizon.goldenHour, true);
  }

  get lunarDistance() {
    console.log('this is a test')
    return this.moon.distance;
  }

  get lunarIlluminosity() {
    return this.moon.illuminosity;
  }
}

module.exports = SolarCalc;
