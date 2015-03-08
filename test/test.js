'use strict';

var assert = require("assert"); // node.js core module
var SolarCalc = require('../'); // our module

var date = new Date('Sun Mar 08 2015 12:18:40 GMT-0500 (EDT)'),
  lat = 35.78,
  lng = -78.649999,
  offset = -5,
  dst = true;

describe('suncalc', function() {
  var solarCalc;

  beforeEach(function() {
    solarCalc = new SolarCalc(
      new Date('Mar 08 2015'),
      35.78,
      -78.649999,
      -5,
      true
    );
  });

  it('get julian date for a given date', function() {
    assert.equal(2457089.5, solarCalc.julianDate);
  });

  it('get golden hour start for a given date and location', function() {
    assert.equal('18:42', solarCalc.goldenHourStart);
  });

   it('get golden hour end for a given date and location', function() {
    assert.equal('08:10', solarCalc.goldenHourEnd);
  });

  it('get night end for a given date and location', function() {
    assert.equal('06:11', solarCalc.nightEnd);
  });

  it('get nautical dawn for a given date and location', function() {
    assert.equal('06:40', solarCalc.nauticalDawn);
  });

  it('get dawn for a given date and location', function() {
    assert.equal('07:10', solarCalc.dawn);
  });

  it('get sunrise for a given date and location', function() {
    assert.equal('07:36', solarCalc.sunrise);
  });

  it('get sunriseEnd for a given date and location', function() {
    assert.equal('07:38', solarCalc.sunriseEnd);
  });

  it('get sunsetStart for a given date and location', function() {
    assert.equal('19:13', solarCalc.sunsetStart);
  });

  it('get sunset for a given date and location', function() {
    assert.equal('19:16', solarCalc.sunset);
  });

  it('get dusk for a given date and location', function() {
    assert.equal('19:41', solarCalc.dusk);
  });

  it('get nautical dusk for a given date and location', function() {
    assert.equal('20:11', solarCalc.nauticalDusk);
  });

  it('get night start for a given date and location', function() {
    assert.equal('20:41', solarCalc.nightStart);
  });



});
