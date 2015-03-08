'use strict';

var Julian = require('julian-date');
// var moment = require('moment-timezone');

var angles = {
  sunrise: 0.833,
  sunriseEnd: 0.3,
  twilight: 6,
  nauticalTwilight: 12,
  night: 18,
  goldenHour: -6
};

var SolarCalc = function(date, lat, long, offset, dst) {
  this.date = date;
  this.lat = lat;
  this.long = long;
  this.offset = offset || 0;
  this.dst = dst || false;
  this.julianDate = getJD(date);

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




function calcTimeJulianCent(jd)
{
  var T = (jd - 2451545.0)/36525.0
  return T
}

function calcJDFromJulianCent(t)
{
  var JD = t * 36525.0 + 2451545.0
  return JD
}

function isLeapYear(yr) 
{
  return ((yr % 4 == 0 && yr % 100 != 0) || yr % 400 == 0);
}

function calcDoyFromJD(jd)
{
  var z = Math.floor(jd + 0.5);
  var f = (jd + 0.5) - z;
  if (z < 2299161) {
    var A = z;
  } else {
    alpha = Math.floor((z - 1867216.25)/36524.25);
    var A = z + 1 + alpha - Math.floor(alpha/4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1)/365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D)/30.6001);
  var day = B - D - Math.floor(30.6001 * E) + f;
  var month = (E < 14) ? E - 1 : E - 13;
  var year = (month > 2) ? C - 4716 : C - 4715;

  var k = (isLeapYear(year) ? 1 : 2);
  var doy = Math.floor((275 * month)/9) - k * Math.floor((month + 9)/12) + day -30;
  return doy;
}


function radToDeg(angleRad) 
{
  return (180.0 * angleRad / Math.PI);
}

function degToRad(angleDeg) 
{
  return (Math.PI * angleDeg / 180.0);
}

function calcGeomMeanLongSun(t)
{
  var L0 = 280.46646 + t * (36000.76983 + t*(0.0003032))
  while(L0 > 360.0)
  {
    L0 -= 360.0
  }
  while(L0 < 0.0)
  {
    L0 += 360.0
  }
  return L0   // in degrees
}

function calcGeomMeanAnomalySun(t)
{
  var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  return M;   // in degrees
}

function calcEccentricityEarthOrbit(t)
{
  var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  return e;   // unitless
}

function calcSunEqOfCenter(t)
{
  var m = calcGeomMeanAnomalySun(t);
  var mrad = degToRad(m);
  var sinm = Math.sin(mrad);
  var sin2m = Math.sin(mrad+mrad);
  var sin3m = Math.sin(mrad+mrad+mrad);
  var C = sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin2m * (0.019993 - 0.000101 * t) + sin3m * 0.000289;
  return C;   // in degrees
}

function calcSunTrueLong(t)
{
  var l0 = calcGeomMeanLongSun(t);
  var c = calcSunEqOfCenter(t);
  var O = l0 + c;
  return O;   // in degrees
}

function calcSunTrueAnomaly(t)
{
  var m = calcGeomMeanAnomalySun(t);
  var c = calcSunEqOfCenter(t);
  var v = m + c;
  return v;   // in degrees
}

function calcSunRadVector(t)
{
  var v = calcSunTrueAnomaly(t);
  var e = calcEccentricityEarthOrbit(t);
  var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(v)));
  return R;   // in AUs
}

function calcSunApparentLong(t)
{
  var o = calcSunTrueLong(t);
  var omega = 125.04 - 1934.136 * t;
  var lambda = o - 0.00569 - 0.00478 * Math.sin(degToRad(omega));
  return lambda;    // in degrees
}

function calcMeanObliquityOfEcliptic(t)
{
  var seconds = 21.448 - t*(46.8150 + t*(0.00059 - t*(0.001813)));
  var e0 = 23.0 + (26.0 + (seconds/60.0))/60.0;
  return e0;    // in degrees
}

function calcObliquityCorrection(t)
{
  var e0 = calcMeanObliquityOfEcliptic(t);
  var omega = 125.04 - 1934.136 * t;
  var e = e0 + 0.00256 * Math.cos(degToRad(omega));
  return e;   // in degrees
}

function calcSunRtAscension(t)
{
  var e = calcObliquityCorrection(t);
  var lambda = calcSunApparentLong(t);
  var tananum = (Math.cos(degToRad(e)) * Math.sin(degToRad(lambda)));
  var tanadenom = (Math.cos(degToRad(lambda)));
  var alpha = radToDeg(Math.atan2(tananum, tanadenom));
  return alpha;   // in degrees
}

function calcSunDeclination(t)
{
  var e = calcObliquityCorrection(t);
  var lambda = calcSunApparentLong(t);

  var sint = Math.sin(degToRad(e)) * Math.sin(degToRad(lambda));
  var theta = radToDeg(Math.asin(sint));
  return theta;   // in degrees
}

function calcEquationOfTime(t)
{
  var epsilon = calcObliquityCorrection(t);
  var l0 = calcGeomMeanLongSun(t);
  var e = calcEccentricityEarthOrbit(t);
  var m = calcGeomMeanAnomalySun(t);

  var y = Math.tan(degToRad(epsilon)/2.0);
  y *= y;

  var sin2l0 = Math.sin(2.0 * degToRad(l0));
  var sinm   = Math.sin(degToRad(m));
  var cos2l0 = Math.cos(2.0 * degToRad(l0));
  var sin4l0 = Math.sin(4.0 * degToRad(l0));
  var sin2m  = Math.sin(2.0 * degToRad(m));

  var Etime = y * sin2l0 - 2.0 * e * sinm + 4.0 * e * y * sinm * cos2l0 - 0.5 * y * y * sin4l0 - 1.25 * e * e * sin2m;
  return radToDeg(Etime)*4.0; // in minutes of time
}

function calcHourAngle(angle,lat, solarDec)
{
  var latRad = degToRad(lat);
  var sdRad  = degToRad(solarDec);
  var HAarg = (Math.cos(degToRad(90 + angle))/(Math.cos(latRad)*Math.cos(sdRad))-Math.tan(latRad) * Math.tan(sdRad));
  var HA = Math.acos(HAarg);
  return HA;    // in radians (for sunset, use -HA)
}

function isNumber(inputVal) 
{
  var oneDecimal = false;
  var inputStr = "" + inputVal;
  for (var i = 0; i < inputStr.length; i++) 
  {
    var oneChar = inputStr.charAt(i);
    if (i == 0 && (oneChar == "-" || oneChar == "+"))
    {
      continue;
    }
    if (oneChar == "." && !oneDecimal) 
    {
      oneDecimal = true;
      continue;
    }
    if (oneChar < "0" || oneChar > "9")
    {
      return false;
    }
  }
  return true;
}

function getJD(date)
{
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var A = Math.floor(year/100);
  var B = 2 - A + Math.floor(A/4);
  var JD = Math.floor(365.25*(year + 4716)) + Math.floor(30.6001*(month+1)) + day + B - 1524.5;
  return JD;
}

function calcAzEl(output, T, localtime, latitude, longitude, zone)
{
  var eqTime = calcEquationOfTime(T)
  var theta  = calcSunDeclination(T)
  if (output) {
    document.getElementById("eqtbox").value = Math.floor(eqTime*100 +0.5)/100.0
    document.getElementById("sdbox").value = Math.floor(theta*100+0.5)/100.0
  }
  var solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone
  var earthRadVec = calcSunRadVector(T)
  var trueSolarTime = localtime + solarTimeFix
  while (trueSolarTime > 1440)
  {
    trueSolarTime -= 1440
  }
  var hourAngle = trueSolarTime / 4.0 - 180.0;
  if (hourAngle < -180) 
  {
    hourAngle += 360.0
  }
  var haRad = degToRad(hourAngle)
  var csz = Math.sin(degToRad(latitude)) * Math.sin(degToRad(theta)) + Math.cos(degToRad(latitude)) * Math.cos(degToRad(theta)) * Math.cos(haRad)
  if (csz > 1.0) 
  {
    csz = 1.0
  } else if (csz < -1.0) 
  { 
    csz = -1.0
  }
  var zenith = radToDeg(Math.acos(csz))
  var azDenom = ( Math.cos(degToRad(latitude)) * Math.sin(degToRad(zenith)) )
  if (Math.abs(azDenom) > 0.001) {
    azRad = (( Math.sin(degToRad(latitude)) * Math.cos(degToRad(zenith)) ) - Math.sin(degToRad(theta))) / azDenom
    if (Math.abs(azRad) > 1.0) {
      if (azRad < 0) {
  azRad = -1.0
      } else {
  azRad = 1.0
      }
    }
    var azimuth = 180.0 - radToDeg(Math.acos(azRad))
    if (hourAngle > 0.0) {
      azimuth = -azimuth
    }
  } else {
    if (latitude > 0.0) {
      azimuth = 180.0
    } else { 
      azimuth = 0.0
    }
  }
  if (azimuth < 0.0) {
    azimuth += 360.0
  }
  var exoatmElevation = 90.0 - zenith

// Atmospheric Refraction correction

  if (exoatmElevation > 85.0) {
    var refractionCorrection = 0.0;
  } else {
    var te = Math.tan (degToRad(exoatmElevation));
    if (exoatmElevation > 5.0) {
      var refractionCorrection = 58.1 / te - 0.07 / (te*te*te) + 0.000086 / (te*te*te*te*te);
    } else if (exoatmElevation > -0.575) {
      var refractionCorrection = 1735.0 + exoatmElevation * (-518.2 + exoatmElevation * (103.4 + exoatmElevation * (-12.79 + exoatmElevation * 0.711) ) );
    } else {
      var refractionCorrection = -20.774 / te;
    }
    refractionCorrection = refractionCorrection / 3600.0;
  }

  var solarZen = zenith - refractionCorrection;

  if ((output) && (solarZen > 108.0) ) {
    document.getElementById("azbox").value = "dark"
    document.getElementById("elbox").value = "dark"
  } else if (output) {
    document.getElementById("azbox").value = Math.floor(azimuth*100 +0.5)/100.0
    document.getElementById("elbox").value = Math.floor((90.0-solarZen)*100+0.5)/100.0
    if (document.getElementById("showae").checked) {
      showLineGeodesic2("azimuth", "#ffff00", azimuth)
    }
  }
  return (azimuth)
}

function calcSolNoon(jd, longitude, timezone, dst)
{
  var tnoon = calcTimeJulianCent(jd - longitude/360.0)
  var eqTime = calcEquationOfTime(tnoon)
  var solNoonOffset = 720.0 - (longitude * 4) - eqTime // in minutes
  var newt = calcTimeJulianCent(jd + solNoonOffset/1440.0)
  eqTime = calcEquationOfTime(newt)
  solNoonLocal = 720 - (longitude * 4) - eqTime + (timezone*60.0)// in minutes
  if(dst) solNoonLocal += 60.0
  while (solNoonLocal < 0.0) {
    solNoonLocal += 1440.0;
  }
  while (solNoonLocal >= 1440.0) {
    solNoonLocal -= 1440.0;
  }
  document.getElementById("noonbox").value = timeString(solNoonLocal, 3)
}

function dayString(jd, next, flag)
{
// returns a string in the form DDMMMYYYY[ next] to display prev/next rise/set
// flag=2 for DD MMM, 3 for DD MM YYYY, 4 for DDMMYYYY next/prev
  if ( (jd < 900000) || (jd > 2817000) ) {
    var output = "error"
  } else {
  var z = Math.floor(jd + 0.5);
  var f = (jd + 0.5) - z;
  if (z < 2299161) {
    var A = z;
  } else {
    alpha = Math.floor((z - 1867216.25)/36524.25);
    var A = z + 1 + alpha - Math.floor(alpha/4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1)/365.25);
  var D = Math.floor(365.25 * C);
  var E = Math.floor((B - D)/30.6001);
  var day = B - D - Math.floor(30.6001 * E) + f;
  var month = (E < 14) ? E - 1 : E - 13;
  var year = ((month > 2) ? C - 4716 : C - 4715);
  if (flag == 2)
    var output = zeroPad(day,2) + " " + monthList[month-1].abbr;
  if (flag == 3)
    var output = zeroPad(day,2) + monthList[month-1].abbr + year.toString();
  if (flag == 4)
    var output = zeroPad(day,2) + monthList[month-1].abbr + year.toString() + ((next) ? " next" : " prev");
  }
  return output;
}

function timeDateString(JD, minutes)
{
  var output = timeString(minutes, 2) + " " + dayString(JD, 0, 2);
  return output;
}

function timeString(minutes, flag)
// timeString returns a zero-padded string (HH:MM:SS) given time in minutes
// flag=2 for HH:MM, 3 for HH:MM:SS
{
  if ( (minutes >= 0) && (minutes < 1440) ) {
    var floatHour = minutes / 60.0;
    var hour = Math.floor(floatHour);
    var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
    var minute = Math.floor(floatMinute);
    var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
    var second = Math.floor(floatSec + 0.5);
    if (second > 59) {
      second = 0
      minute += 1
    }
    if ((flag == 2) && (second >= 30)) minute++;
    if (minute > 59) {
      minute = 0
      hour += 1
    }
    var output = zeroPad(hour,2) + ":" + zeroPad(minute,2);
    if (flag > 2) output = output + ":" + zeroPad(second,2);
  } else { 
    var output = "error"
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
function calcSunriseSetUTC(rise, type, JD, latitude, longitude)
{
  var angle = angles[type];
  var t = calcTimeJulianCent(JD);
  var eqTime = calcEquationOfTime(t);
  var solarDec = calcSunDeclination(t);
  var hourAngle = calcHourAngle(angle,latitude, solarDec);
  //alert("HA = " + radToDeg(hourAngle));
  if (!rise) hourAngle = -hourAngle;
  var delta = longitude + radToDeg(hourAngle);
  var timeUTC = 720 - (4.0 * delta) - eqTime; // in minutes
  return timeUTC
}

function calcSunriseSet(rise, type, JD, latitude, longitude, timezone, dst)
// rise = 1 for sunrise, 0 for sunset
{
  var timeUTC = calcSunriseSetUTC(rise, type, JD, latitude, longitude);
  var newTimeUTC = calcSunriseSetUTC(rise, type, JD + timeUTC/1440.0, latitude, longitude); 
  if (isNumber(newTimeUTC)) {
    var timeLocal = newTimeUTC + (timezone * 60.0)
    // if (document.getElementById(rise ? "showsr" : "showss").checked) {
    //   var riseT = calcTimeJulianCent(JD + newTimeUTC/1440.0)
    //   var riseAz = calcAzEl(0, riseT, timeLocal, latitude, longitude, timezone)
    //   if (rise) {
    //     showLineGeodesic2("sunrise", "#66ff00", riseAz);
    //   } else {
    //     showLineGeodesic2("sunset", "#ff0000", riseAz);
    //   }
    // }
    timeLocal += ((dst) ? 60.0 : 0.0);
    if ( (timeLocal >= 0.0) && (timeLocal < 1440.0) ) {
      return timeString(timeLocal,2)
    } else  {
      var jday = JD
      var increment = ((timeLocal < 0) ? 1 : -1)
      while ((timeLocal < 0.0)||(timeLocal >= 1440.0)) {
        timeLocal += increment * 1440.0
  jday -= increment
      }
      return timeDateString(jday,timeLocal)
    }
  } else { // no sunrise/set found
    var doy = calcDoyFromJD(JD)
    if ( ((latitude > 66.4) && (doy > 79) && (doy < 267)) ||
  ((latitude < -66.4) && ((doy < 83) || (doy > 263))) )
    {   //previous sunrise/next sunset
      if (rise) { // find previous sunrise
        jdy = calcJDofNextPrevRiseSet(0, rise, JD, latitude, longitude, timezone, dst)
      } else { // find next sunset
        jdy = calcJDofNextPrevRiseSet(1, rise, JD, latitude, longitude, timezone, dst)
      }
      return dayString(jdy,0,3)
    } else {   //previous sunset/next sunrise
      if (rise == 1) { // find previous sunrise
        jdy = calcJDofNextPrevRiseSet(1, rise, JD, latitude, longitude, timezone, dst)
      } else { // find next sunset
        jdy = calcJDofNextPrevRiseSet(0, rise, JD, latitude, longitude, timezone, dst)
      }
      return dayString(jdy,0,3)
    }
  }
}

function calcJDofNextPrevRiseSet(next, rise, JD, latitude, longitude, tz, dst)
{
  var julianday = JD;
  var increment = ((next) ? 1.0 : -1.0);

  var time = calcSunriseSetUTC(rise, julianday, latitude, longitude);
  while(!isNumber(time)){
    julianday += increment;
    time = calcSunriseSetUTC(rise, julianday, latitude, longitude);
  }
  var timeLocal = time + tz * 60.0 + ((dst) ? 60.0 : 0.0)
  while ((timeLocal < 0.0) || (timeLocal >= 1440.0))
  {
    var incr = ((timeLocal < 0) ? 1 : -1)
    timeLocal += (incr * 1440.0)
    julianday -= incr
  }
  return julianday;
}

function calculate() {
  //refreshMap()
  //clearOutputs()
  //map.clearOverlays()
  //showMarkers()
  // var jday = getJD()
  // var tl = getTimeLocal()
  // var tz = readTextBox("zonebox", 5, 0, 0, -14, 13, 0)
  // var dst = document.getElementById("dstCheckbox").checked
  // var total = jday + tl/1440.0 - tz/24.0
  // var T = calcTimeJulianCent(total)
  // var lat = parseFloat(document.getElementById("latbox").value.substring(0,9))
  // var lng = parseFloat(document.getElementById("lngbox").value.substring(0,10))
  // calcAzEl(1, T, tl, lat, lng, tz)
  // calcSolNoon(jday, lng, tz, dst)
  // var rise = calcSunriseSet(1, jday, lat, lng, tz, dst)
  // var set  = calcSunriseSet(0, jday, lat, lng, tz, dst)
  //alert("JD " + jday + "  " + rise + "  " + set + "  ")
}

module.exports = SolarCalc;
