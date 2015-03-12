'use strict';

var assert = require("assert"); // node.js core module
var  Moon = require('../lib/moon.js'); // our module

describe('suncalc', function() {
  
  describe('Moon', function() {
    

    it('get illuminated', function() {
      var moon = new Moon(new Date('2015-03-12'))

      assert.equal(74, Math.round(moon.illuminated));
    });

    it('get distance', function() {
      var moon = new Moon(new Date('2015-03-12'))

      assert.equal(399910, moon.distance);
    });


  });

  

});
