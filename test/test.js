'use strict';

var assert = require("assert"); // node.js core module
var SolarCalc = require('../'); // our module

describe('suncalc', function() {
  
  describe('2015-03-08 in North Carolina', function() {
    var solarCalc;

    beforeEach(function() {
      solarCalc = new SolarCalc(
        new Date('Mar 08 2015'),
        35.78,
        -78.649999
      );
    });

    it('get solar noon', function() {
      assert.equal(1425835523000, solarCalc.solarNoon.getTime());
    });

    it('get golden hour start', function() {
      assert.equal(1425854506000, solarCalc.goldenHourStart.getTime());
    });

     it('get golden hour end', function() {
      assert.equal(1425816570000, solarCalc.goldenHourEnd.getTime());
    });

    it('get night end', function() {
      assert.equal(1425809446000, solarCalc.nightEnd.getTime());
    });

    it('get nautical dawn', function() {
      assert.equal(1425811226000, solarCalc.nauticalDawn.getTime());
    });

    it('get dawn', function() {
      assert.equal(1425813000000, solarCalc.dawn.getTime());
    });

    it('get sunrise', function() {
      assert.equal(1425814530000, solarCalc.sunrise.getTime());
    });

    it('get sunriseEnd', function() {
      assert.equal(1425814688000, solarCalc.sunriseEnd.getTime());
    });

    it('get sunsetStart', function() {
      assert.equal(1425856389000, solarCalc.sunsetStart.getTime());
    });

    it('get sunset', function() {
      assert.equal(1425856548000, solarCalc.sunset.getTime());
    });

    it('get dusk', function() {
      assert.equal(1425858080000, solarCalc.dusk.getTime());
    });

    it('get nautical dusk', function() {
      assert.equal(1425859857000, solarCalc.nauticalDusk.getTime());
    });

    it('get night start', function() {
      assert.equal(1425861641000, solarCalc.nightStart.getTime());
    });

    it('should get moon illuminosity', function() {
      assert.equal(83, Math.round(solarCalc.lunarIlluminosity * 100));
    });

    it('should get moon distance', function() {
      assert.equal(384758, solarCalc.lunarDistance);
    });

  });

  describe('2015-06-23 in extreme latitude', function() {
    var solarCalc;

    beforeEach(function() {
      solarCalc = new SolarCalc(
        new Date('Jun 23 2015'),
        82.4508,
        -62.5056,
        -4,
        false
      );
    });

    it('get solar noon', function() {
      assert.equal(1435075933000, solarCalc.solarNoon.getTime());
    });

    it('get golden hour start', function() {
      assert.equal(1439856000000, solarCalc.goldenHourStart.getTime());
    });

     it('get golden hour end', function() {
      assert.equal(1430006400000, solarCalc.goldenHourEnd.getTime());
    });

    it('get night end', function() {
      assert.equal(1424476800000, solarCalc.nightEnd.getTime());
    });

    it('get nautical dawn', function() {
      assert.equal(1425859200000, solarCalc.nauticalDawn.getTime());
    });

    it('get dawn', function() {
      assert.equal(1427155200000, solarCalc.dawn.getTime());
    });

    it('get sunrise', function() {
      assert.equal(1428364800000, solarCalc.sunrise.getTime());
    });

    it('get sunriseEnd', function() {
      assert.equal(1428451200000, solarCalc.sunriseEnd.getTime());
    });

    it('get sunsetStart', function() {
      assert.equal(1441411200000, solarCalc.sunsetStart.getTime());
    });

    it('get sunset', function() {
      assert.equal(1441497600000, solarCalc.sunset.getTime());
    });

    it('get dusk', function() {
      assert.equal(1442707200000, solarCalc.dusk.getTime());
    });

    it('get nautical dusk', function() {
      assert.equal(1444003200000, solarCalc.nauticalDusk.getTime());
    });

    it('get night start', function() {
      assert.equal(1445385600000, solarCalc.nightStart.getTime());
    });

    it('should get moon illuminosity', function() {
      assert.equal(22, Math.round(solarCalc.lunarIlluminosity * 100));
    });

    it('should get moon distance', function() {
      assert.equal(378178, solarCalc.lunarDistance);
    });
  });

  describe('2017-10-10 in Cleveland', function() {
    var solarCalc;

    beforeEach(function() {
      var customZones={"tzeit": {angle:8.5,rising:false},
      "alot_hashachar": {angle:16.1,rising:true},
      "misheyakir_machmir":{angle:10.2,rising:true}};

      solarCalc = new SolarCalc(
        new Date('Oct 10 2017'),
        41.503081,
        -81.58916,
        customZones
      );
    });

    it('get alos', function() {
      assert.equal(1507630274000, solarCalc.alot_hashachar.getTime());
    });
    it('get dawn', function() {
      assert.equal(1507633517000, solarCalc.dawn.getTime());
    });

    it('get sunrise', function() {
      assert.equal(1507635184000, solarCalc.sunrise.getTime());
    });

    it('get sunriseEnd', function() {
      assert.equal(1507635357000, solarCalc.sunriseEnd.getTime());
    });

    it('get sunsetStart', function() {
      assert.equal(1507675793000, solarCalc.sunsetStart.getTime());
    });

    it('get sunset', function() {
      assert.equal(1507675965000, solarCalc.sunset.getTime());
    });
    it('get misheyakir_machmir', function() {
      assert.equal(1507632169000, solarCalc.misheyakir_machmir.getTime());
    });

    it('get 3 different times', function() {
      assert.equal(1507678431000, solarCalc.tzeit.getTime());
      assert.equal(1507632169000, solarCalc.misheyakir_machmir.getTime());
      assert.equal(1507635184000, solarCalc.sunrise.getTime());
    });
    it('should throw exception for unknown property', function() {
       assert.throws(
           () => {
               solarCalc.noname.getTime();
           },
           function(err) {
               if ((err instanceof Error) && /Unknown property: noname/.test(err)) {
                   return true;
               }
           },
           'unexpected error');
  });
  });

});
