'use strict';

// var moment = require('moment-timezone');

var angles = {
  sunrise: 0.833,
  sunriseEnd: 0.3,
  twilight: 6,
  nauticalTwilight: 12,
  night: 18,
  goldenHour: -6
};

function Month(name, numdays, abbr) {
  this.name = name;
  this.numdays = numdays;
  this.abbr = abbr;
}

var monthList = [];
monthList.push(new Month('January', 31, 'Jan'));
monthList.push(new Month('February', 28, 'Feb'));
monthList.push(new Month('March', 31, 'Mar'));
monthList.push(new Month('April', 30, 'Apr'));
monthList.push(new Month('May', 31, 'May'));
monthList.push(new Month('June', 30, 'Jun'));
monthList.push(new Month('July', 31, 'Jul'));
monthList.push(new Month('August', 31, 'Aug'));
monthList.push(new Month('September', 30, 'Sep'));
monthList.push(new Month('October', 31, 'Oct'));
monthList.push(new Month('November', 30, 'Nov'));
monthList.push(new Month('December', 31, 'Dec'));

var SolarCalc = function(date, lat, long, offset, dst) {
  this.date = date;
  this.lat = lat;
  this.long = long;
  this.offset = offset || 0;
  this.dst = dst || false;
  this.julianDate = getJD(date);

  this.solarNoon = calcSolNoon(this.julianDate, this.long, this.offset, this.dst);

  this.sunrise = calcSunriseSet(true, 'sunrise', this.julianDate, this.lat, this.long, this.offset, this.dst);
  this.sunset = calcSunriseSet(false, 'sunrise', this.julianDate, this.lat, this.long, this.offset, this.dst);

  this.sunriseEnd = calcSunriseSet(true, 'sunriseEnd', this.julianDate, this.lat, this.long, this.offset, this.dst);
  this.sunsetStart = calcSunriseSet(false, 'sunriseEnd', this.julianDate, this.lat, this.long, this.offset, this.dst);

  this.dawn = calcSunriseSet(true, 'twilight', this.julianDate, this.lat, this.long, this.offset, this.dst);
  this.dusk = calcSunriseSet(false, 'twilight', this.julianDate, this.lat, this.long, this.offset, this.dst);

  this.nauticalDawn = calcSunriseSet(true, 'nauticalTwilight', this.julianDate, this.lat, this.long, this.offset, this.dst);
  this.nauticalDusk = calcSunriseSet(false, 'nauticalTwilight', this.julianDate, this.lat, this.long, this.offset, this.dst);

  this.nightStart = calcSunriseSet(false, 'night', this.julianDate, this.lat, this.long, this.offset, this.dst);
  this.nightEnd = calcSunriseSet(true, 'night', this.julianDate, this.lat, this.long, this.offset, this.dst);

  this.goldenHourStart = calcSunriseSet(false, 'goldenHour', this.julianDate, this.lat, this.long, this.offset, this.dst);
  this.goldenHourEnd = calcSunriseSet(true, 'goldenHour', this.julianDate, this.lat, this.long, this.offset, this.dst);
};




function calcTimeJulianCent(jd) {
  var T = (jd - 2451545.0) / 36525.0;
  return T;
}

function isLeapYear(yr) {
  return ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0);
}

function calcDoyFromJD(jd) {
  var z = Math.floor(jd + 0.5);
  var f = (jd + 0.5) - z;
  var A;
  if (z < 2299161) {
    A = z;
  } else {
    var alpha = Math.floor((z - 1867216.25) / 36524.25);
    A = z + 1 + alpha - Math.floor(alpha / 4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1) / 365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D) / 30.6001);
  var day = B - D - Math.floor(30.6001 * E) + f;
  var month = (E < 14) ? E - 1 : E - 13;
  var year = (month > 2) ? C - 4716 : C - 4715;

  var k = (isLeapYear(year) ? 1 : 2);
  var doy = Math.floor((275 * month) / 9) - k * Math.floor((month + 9) / 12) + day - 30;
  return doy;
}


function radToDeg(angleRad) {
  return (180.0 * angleRad / Math.PI);
}

function degToRad(angleDeg) {
  return (Math.PI * angleDeg / 180.0);
}

function calcGeomMeanLongSun(t) {
  var L0 = 280.46646 + t * (36000.76983 + t * (0.0003032));
  while (L0 > 360.0) {
    L0 -= 360.0;
  }
  while (L0 < 0.0) {
    L0 += 360.0;
  }
  return L0; // in degrees
}

function calcGeomMeanAnomalySun(t) {
  var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  return M; // in degrees
}

function calcEccentricityEarthOrbit(t) {
  var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  return e; // unitless
}

function calcSunEqOfCenter(t) {
  var m = calcGeomMeanAnomalySun(t);
  var mrad = degToRad(m);
  var sinm = Math.sin(mrad);
  var sin2m = Math.sin(mrad + mrad);
  var sin3m = Math.sin(mrad + mrad + mrad);
  var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
  return C; // in degrees
}

function calcSunTrueLong(t) {
  var l0 = calcGeomMeanLongSun(t);
  var c = calcSunEqOfCenter(t);
  var O = l0 + c;
  return O; // in degrees
}

function calcSunApparentLong(t) {
  var o = calcSunTrueLong(t);
  var omega = 125.04 - 1934.136 * t;
  var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
  return lambda; // in degrees
}

function calcMeanObliquityOfEcliptic(t) {
  var seconds = 21.448 - t * (46.8150 + t * (0.00059 - t * (0.001813)));
  var e0 = 23.0 + (26.0 + (seconds / 60.0)) / 60.0;
  return e0; // in degrees
}

function calcObliquityCorrection(t) {
  var e0 = calcMeanObliquityOfEcliptic(t);
  var omega = 125.04 - 1934.136 * t;
  var e = e0 + 0.00256 * Math.cos(degToRad(omega));
  return e; // in degrees
}

function calcSunDeclination(t) {
  var e = calcObliquityCorrection(t);
  var lambda = calcSunApparentLong(t);

  var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
  var theta = radToDeg(Math.asin(sint));
  return theta; // in degrees
}

function calcEquationOfTime(t) {
  var epsilon = calcObliquityCorrection(t);
  var l0 = calcGeomMeanLongSun(t);
  var e = calcEccentricityEarthOrbit(t);
  var m = calcGeomMeanAnomalySun(t);

  var y = Math.tan(degToRad(epsilon) / 2.0);
  y *= y;

  var sin2l0 = Math.sin(2.0 * degToRad(l0));
  var sinm = Math.sin(degToRad(m));
  var cos2l0 = Math.cos(2.0 * degToRad(l0));
  var sin4l0 = Math.sin(4.0 * degToRad(l0));
  var sin2m = Math.sin(2.0 * degToRad(m));

  var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
  return radToDeg(Etime) * 4.0; // in minutes of time
}

function calcHourAngle(angle, lat, solarDec) {
  var latRad = degToRad(lat);
  var sdRad = degToRad(solarDec);
  var HAarg = (Math.cos(degToRad(90 + angle)) / (Math.cos(latRad) * Math.cos(sdRad)) - Math.tan(latRad) * Math.tan(sdRad));
  var HA = Math.acos(HAarg);
  return HA; // in radians (for sunset, use -HA)
}

function isNumber(inputVal) {
  var oneDecimal = false;
  var inputStr = '' + inputVal;
  for (var i = 0; i < inputStr.length; i++) {
    var oneChar = inputStr.charAt(i);
    if (i === 0 && (oneChar === '-' || oneChar === '+')) {
      continue;
    }
    if (oneChar === '.' && !oneDecimal) {
      oneDecimal = true;
      continue;
    }
    if (oneChar < '0' || oneChar > '9') {
      return false;
    }
  }
  return true;
}

function getJD(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var A = Math.floor(year / 100);
  var B = 2 - A + Math.floor(A / 4);
  var JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  return JD;
}

function calcSolNoon(jd, longitude, timezone, dst) {
  var tnoon = calcTimeJulianCent(jd - longitude / 360.0);
  var eqTime = calcEquationOfTime(tnoon);
  var solNoonOffset = 720.0 - (longitude * 4) - eqTime; // in minutes
  var newt = calcTimeJulianCent(jd + solNoonOffset / 1440.0);
  eqTime = calcEquationOfTime(newt);
  var solNoonLocal = 720 - (longitude * 4) - eqTime + (timezone * 60.0); // in minutes
  if (dst) solNoonLocal += 60.0;
  while (solNoonLocal < 0.0) {
    solNoonLocal += 1440.0;
  }
  while (solNoonLocal >= 1440.0) {
    solNoonLocal -= 1440.0;
  }
  return timeString(solNoonLocal, 3);
}

function dayString(jd, next, flag) {
  // returns a string in the form DDMMMYYYY[ next] to display prev/next rise/set
  // flag=2 for DD MMM, 3 for DD MM YYYY, 4 for DDMMYYYY next/prev
  var output;
  if ((jd < 900000) || (jd > 2817000)) {
    output = 'error';
  } else {
    var z = Math.floor(jd + 0.5);
    var f = (jd + 0.5) - z;
    var A;
    if (z < 2299161) {
      A = z;
    } else {
      var alpha = Math.floor((z - 1867216.25) / 36524.25);
      A = z + 1 + alpha - Math.floor(alpha / 4);
    }
    var B = A + 1524;
    var C = Math.floor((B - 122.1) / 365.25);
    var D = Math.floor(365.25 * C);
    var E = Math.floor((B - D) / 30.6001);
    var day = B - D - Math.floor(30.6001 * E) + f;
    var month = (E < 14) ? E - 1 : E - 13;
    var year = ((month > 2) ? C - 4716 : C - 4715);
    if (flag === 2) output = zeroPad(day, 2) + ' ' + monthList[month - 1].abbr;
    if (flag === 3) output = zeroPad(day, 2) + monthList[month - 1].abbr + year.toString();
    if (flag === 4) output = zeroPad(day, 2) + monthList[month - 1].abbr + year.toString() + ((next) ? ' next' : ' prev');
  }
  return output;
}

function timeDateString(JD, minutes) {
  var output = timeString(minutes, 2) + ' ' + dayString(JD, 0, 2);
  return output;
}

function timeString(minutes, flag)
  // timeString returns a zero-padded string (HH:MM:SS) given time in minutes
  // flag=2 for HH:MM, 3 for HH:MM:SS
  {
    var output = '';
    if ((minutes >= 0) && (minutes < 1440)) {
      var floatHour = minutes / 60.0;
      var hour = Math.floor(floatHour);
      var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
      var minute = Math.floor(floatMinute);
      var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
      var second = Math.floor(floatSec + 0.5);
      if (second > 59) {
        second = 0;
        minute += 1;
      }
      if ((flag === 2) && (second >= 30)) minute++;
      if (minute > 59) {
        minute = 0;
        hour += 1;
      }
      output = zeroPad(hour, 2) + ':' + zeroPad(minute, 2);
      if (flag > 2) output = output + ':' + zeroPad(second, 2);
    } else {
      output = 'error';
    }
    return output;
  }

function zeroPad(n, digits) {
  n = n.toString();
  while (n.length < digits) {
    n = '0' + n;
  }
  return n;
}

function calcSunriseSetUTC(rise, type, JD, latitude, longitude) {
  var angle = angles[type];
  var t = calcTimeJulianCent(JD);
  var eqTime = calcEquationOfTime(t);
  var solarDec = calcSunDeclination(t);
  var hourAngle = calcHourAngle(angle, latitude, solarDec);
  //alert("HA = " + radToDeg(hourAngle));
  if (!rise) hourAngle = -hourAngle;
  var delta = longitude + radToDeg(hourAngle);
  var timeUTC = 720 - (4.0 * delta) - eqTime; // in minutes
  return timeUTC;
}

function calcSunriseSet(rise, type, JD, latitude, longitude, timezone, dst)
  // rise = 1 for sunrise, 0 for sunset
  {
    var timeUTC = calcSunriseSetUTC(rise, type, JD, latitude, longitude);
    var newTimeUTC = calcSunriseSetUTC(rise, type, JD + timeUTC / 1440.0, latitude, longitude);
    if (isNumber(newTimeUTC)) {
      var timeLocal = newTimeUTC + (timezone * 60.0);

      timeLocal += ((dst) ? 60.0 : 0.0);
      if ((timeLocal >= 0.0) && (timeLocal < 1440.0)) {
        return timeString(timeLocal, 2);
      } else {
        var jday = JD;
        var increment = ((timeLocal < 0) ? 1 : -1);
        while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
          timeLocal += increment * 1440.0;
          jday -= increment;
        }
        return timeDateString(jday, timeLocal);
      }
    } else { // no sunrise/set found
      var doy = calcDoyFromJD(JD);
      var jdy;
      if (((latitude > 66.4) && (doy > 79) && (doy < 267)) ||
        ((latitude < -66.4) && ((doy < 83) || (doy > 263)))) { //previous sunrise/next sunset
        jdy = calcJDofNextPrevRiseSet(!rise, rise, JD, latitude, longitude, timezone, dst);
        return dayString(jdy, 0, 3);
      } else { //previous sunset/next sunrise
        jdy = calcJDofNextPrevRiseSet(rise, rise, JD, latitude, longitude, timezone, dst);
        return dayString(jdy, 0, 3);
      }
    }
  }

function calcJDofNextPrevRiseSet(next, rise, JD, latitude, longitude, tz, dst) {
  var julianday = JD;
  var increment = ((next) ? 1.0 : -1.0);

  var time = calcSunriseSetUTC(rise, julianday, latitude, longitude);
  while (!isNumber(time)) {
    julianday += increment;
    time = calcSunriseSetUTC(rise, julianday, latitude, longitude);
  }
  var timeLocal = time + tz * 60.0 + ((dst) ? 60.0 : 0.0);
  while ((timeLocal < 0.0) || (timeLocal >= 1440.0)) {
    var incr = ((timeLocal < 0) ? 1 : -1);
    timeLocal += (incr * 1440.0);
    julianday -= incr;
  }
  return julianday;
}

module.exports = SolarCalc;
