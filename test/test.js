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
    assert.equal(1425854506000, solarCalc.goldenHourStart.getTime());
  });

   it('get golden hour end for a given date and location', function() {
    assert.equal(1425816570000, solarCalc.goldenHourEnd.getTime());
  });

  it('get night end for a given date and location', function() {
    assert.equal(1425809446000, solarCalc.nightEnd.getTime());
  });

  it('get nautical dawn for a given date and location', function() {
    assert.equal(1425811226000, solarCalc.nauticalDawn.getTime());
  });

  it('get dawn for a given date and location', function() {
    assert.equal(1425813000000, solarCalc.dawn.getTime());
  });

  it('get sunrise for a given date and location', function() {
    assert.equal(1425814530000, solarCalc.sunrise.getTime());
  });

  it('get sunriseEnd for a given date and location', function() {
    assert.equal(1425814688000, solarCalc.sunriseEnd.getTime());
  });

  it('get sunsetStart for a given date and location', function() {
    assert.equal(1425856389000, solarCalc.sunsetStart.getTime());
  });

  it('get sunset for a given date and location', function() {
    assert.equal(1425856548000, solarCalc.sunset.getTime());
  });

  it('get dusk for a given date and location', function() {
    assert.equal(1425858080000, solarCalc.dusk.getTime());
  });

  it('get nautical dusk for a given date and location', function() {
    assert.equal(1425859857000, solarCalc.nauticalDusk.getTime());
  });

  it('get night start for a given date and location', function() {
    assert.equal(1425861641000, solarCalc.nightStart.getTime());
  });



});
