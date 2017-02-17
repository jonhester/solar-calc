import test from 'ava';

import SolarCalc from '../src/solarCalc';

let solarCalc1;
let solarCalc2;

test.before('2015-03-08 in North Carolina', () => {
  solarCalc1 = new SolarCalc(
    new Date('Mar 08 2015'),
    35.78,
    -78.649999,
  );
});

test.before('2015-06-23 in extreme latitude', () => {
  solarCalc2 = new SolarCalc(
    new Date('Jun 23 2015'),
      82.4508,
      -62.5056,
      -4,
      false,
  );
});

test('get solar noon', (t) => {
  t.is(solarCalc1.solarNoon.getTime(), 1425835523000);
  t.is(solarCalc2.solarNoon.getTime(), 1435075933000);
});

test('solar hour angle', t => {
  t.is(solarCalc1.solarHourAngle, -186.34583333333333);
});

test('solar zenith angle', t => {
  t.is(solarCalc1.solarZenithAngle, -0.5471282359414158);
})

test.only('solar azimuth angle', t => {
  t.is(solarCalc1.solarAzimuthAngle, -0.5471282359414158);
})

test('solar declination', t => {
  t.is(solarCalc1.solarDeclination, 1);
});

test('golden hour start', (t) => {
  t.is(solarCalc1.goldenHourStart.getTime(), 1425854506000);
  t.is(solarCalc2.goldenHourStart.getTime(), 1439856000000);
});

test('golden hour end', (t) => {
  t.is(solarCalc1.goldenHourEnd.getTime(), 1425816570000);
  t.is(solarCalc2.goldenHourEnd.getTime(), 1430006400000);
});

test('get night end', (t) => {
  t.is(solarCalc1.nightEnd.getTime(), 1425809446000);
  t.is(solarCalc2.nightEnd.getTime(), 1424476800000);
});

test('nautical dawn', (t) => {
  t.is(solarCalc1.nauticalDawn.getTime(), 1425811226000);
  t.is(solarCalc2.nauticalDawn.getTime(), 1425859200000);
});

test('get dawn', (t) => {
  t.is(solarCalc1.dawn.getTime(), 1425813000000);
  t.is(solarCalc2.dawn.getTime(), 1427155200000);
});

test('get sunrise', (t) => {
  t.is(solarCalc1.sunrise.getTime(), 1425814530000);
  t.is(solarCalc2.sunrise.getTime(), 1428364800000);
});

test('sunrise end', (t) => {
  t.is(solarCalc1.sunriseEnd.getTime(), 1425814688000);
  t.is(solarCalc2.sunriseEnd.getTime(), 1428451200000);
});

test('sunset start', (t) => {
  t.is(solarCalc1.sunsetStart.getTime(), 1425856389000);
  t.is(solarCalc2.sunsetStart.getTime(), 1441411200000);
});

test('sunset', (t) => {
  t.is(solarCalc1.sunset.getTime(), 1425856548000);
  t.is(solarCalc2.sunset.getTime(), 1441497600000);
});

test('dusk', (t) => {
  t.is(solarCalc1.dusk.getTime(), 1425858080000);
  t.is(solarCalc2.dusk.getTime(), 1442707200000);
});

test('nautical dusk', (t) => {
  t.is(solarCalc1.nauticalDusk.getTime(), 1425859857000);
  t.is(solarCalc2.nauticalDusk.getTime(), 1444003200000);
});

test('night start', (t) => {
  t.is(solarCalc1.nightStart.getTime(), 1425861641000);
  t.is(solarCalc2.nightStart.getTime(), 1445385600000);
});

test('moon illuminosity', (t) => {
  t.is(Math.round(solarCalc1.lunarIlluminosity * 100), 83);
  t.is(Math.round(solarCalc2.lunarIlluminosity * 100), 22);
});

test('moon distance', (t) => {
  t.is(solarCalc1.lunarDistance, 384758);
  t.is(solarCalc2.lunarDistance, 378178);
});
