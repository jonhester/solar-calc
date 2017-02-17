import moment from 'moment';

import Sun from './sun';
import Moon from './moon';

const round = (number, precision) => {
  const factor = 10 ** precision;
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const toDegrees = (degrees) => {
  return degrees * (180 /  Math.PI);
};

const degreesBelowHorizon = {
  sunrise: 0.833,
  sunriseEnd: 0.3,
  twilight: 6,
  nauticalTwilight: 12,
  night: 18,
  goldenHour: -6,
};

class SolarCalc {
  constructor(date, latitude, longitude) {
    this.date = date;
    this.lat = latitude;
    this.longitude = longitude;

    this.sun = new Sun(date, latitude, longitude);
    this.moon = new Moon(date, latitude, longitude);
  }

  get solarNoon() {
    return this.sun.solarNoon;
  }

  get solarAzimuthAngle() {
    const declination = toRadians(this.solarDeclination);
    const zenith = toRadians(this.solarZenithAngle);

    const numerator = -(Math.sin(toRadians(this.solarHourAngle)) * Math.cos(declination));
    const denominator = Math.sin(zenith);
    console.log('n', numerator)
    console.log('d', denominator);
    console.log(numerator/denominator);
    console.log(Math.asin(numerator / denominator));
    return toDegrees(Math.asin(numerator / denominator));
  }

  get solarHourAngle() {
    const differenceInHours = (this.date - this.solarNoon) / 1000 / 60 / 60;
    return differenceInHours * 15;
  }

  get solarZenithAngle() {
    const declination = toRadians(this.solarDeclination);
    const lat = toRadians(this.lat);
    const zenithRadians = (Math.sin(lat) * Math.sin(declination)) +
      (Math.cos(lat) * Math.cos(declination) *
      Math.cos(toRadians(this.solarHourAngle)));

    return toDegrees(zenithRadians);
  }

  get ordinalDay() {
    const startOfYear = moment().startOf('year').format('YYYY-MM-DD');
    const startOfYearUTC = moment.utc(startOfYear);
    return moment(this.date).diff(startOfYearUTC) / 86400 / 1000;
  }

  get solarDeclination() {
    const n = this.ordinalDay;
    const radians = -Math.asin(0.39779 * Math.cos(toRadians(0.985665) * (n + 10) + toRadians(1.914) * Math.sin(toRadians(0.98665) * (n - 2))));
    return toDegrees(radians);
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

  get civilDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.twilight, true);
  }

  get dawn() {
    return this.civilDawn;
  }

  get civilDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.twilight, false);
  }

  get dusk() {
    return this.civilDusk;
  }

  get nauticalDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.nauticalTwilight, true);
  }

  get nauticalDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.nauticalTwilight, false);
  }

  get nightStart() {
    return this.astronomicalDusk;
  }

  get astronomicalDusk() {
    return this.sun.timeAtAngle(degreesBelowHorizon.night, false);
  }

  get astronomicalDawn() {
    return this.sun.timeAtAngle(degreesBelowHorizon.night, true);
  }

  get nightEnd() {
    return this.astronomicalDawn;
  }

  get goldenHourStart() {
    return this.sun.timeAtAngle(degreesBelowHorizon.goldenHour, false);
  }

  get goldenHourEnd() {
    return this.sun.timeAtAngle(degreesBelowHorizon.goldenHour, true);
  }

  get lunarDistance() {
    return this.moon.distance;
  }

  get lunarIlluminosity() {
    return this.moon.illuminosity;
  }
}

module.exports = SolarCalc;
