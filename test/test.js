'use strict';

var assert = require("assert"); // node.js core module
var SolarCalc = require('../');  // our module

var date = new Date('2013-03-05UTC'),
    lat = 50.5,
    lng = 30.5;

var testTimes = {
    solarNoon: '2013-03-05T10:10:57Z',
    nadir: '2013-03-04T22:10:57Z',
    sunrise: '2013-03-05T04:34:56Z',
    sunset: '2013-03-05T15:46:57Z',
    sunriseEnd: '2013-03-05T04:38:19Z',
    sunsetStart: '2013-03-05T15:43:34Z',
    dawn: '2013-03-05T04:02:17Z',
    dusk: '2013-03-05T16:19:36Z',
    nauticalDawn: '2013-03-05T03:24:31Z',
    nauticalDusk: '2013-03-05T16:57:22Z',
    nightEnd: '2013-03-05T02:46:17Z',
    night: '2013-03-05T17:35:36Z',
    goldenHourEnd: '2013-03-05T05:19:01Z',
    goldenHour: '2013-03-05T15:02:52Z'
};



describe('suncalc', function() {

  it('getPosition returns azimuth and altitude for the given time and location', function () {
    var sunPos = SolarCalc.getPosition(date, lat, lng);

    assert.equal(sunPos.azimuth,  0.6412750628729547);
    assert.equal(sunPos.altitude, -0.7000406838781611);
  });
  
  it('should return sun phases for the given date and location', function() {
    var times = SolarCalc.getTimes(date,lat,lng);

    for (var i in testTimes) {
      assert.equal(new Date(testTimes[i]).toUTCString(), times[i].toUTCString(), i);
    }
  });

  it('should return moon position data for given time and location', function() {
    var moonPos = SolarCalc.getMoonPosition(date, lat, lng);

    assert.ok(Math.abs(-0.9783999522438226-moonPos.azimuth) < 1E15);
    assert.ok(Math.abs(0.00696972775489191-moonPos.altitude) < 1E15);
    assert.ok(Math.abs(364121.37256256194-moonPos.distance) < 1E15);
  });
  
  it('should return fraction and angle of moon\'s illuminated limb and phase', function() {
    var moonIllum = SolarCalc.getMoonIllumination(date);

    assert.ok(Math.abs(moonIllum.fraction - 0.4848068202456373) < 1E15);
    assert.ok(Math.abs(moonIllum.phase - 0.7548368838538762) < 1E15);
    assert.ok(Math.abs(moonIllum.angle - 1.6732942678578346) < 1E15);

  });

  it('should return moon rise and set times for given date and location', function() {
    var moonTimes = SolarCalc.getMoonTimes(date,lat,lng);

    assert.equal(moonTimes, 'Mon, 04 Mar 2013 23:57:52 GMT');
    assert.equal(moonTimes.set.toUTCString(), 'Mon, 04 Mar 2013 07:19:22 GMT');

  });

});
