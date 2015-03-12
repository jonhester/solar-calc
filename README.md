# solar-calc [![npm](https://img.shields.io/npm/v/solar-calc.svg)](https://www.npmjs.com/package/solar-calc) [![Build Status](https://travis-ci.org/jonhester/solar-calc.svg)](https://travis-ci.org/jonhester/solar-calc/builds)
A sunrise and sunset calculator for npm based on the NOAA Solar Calculator.

```js
var SolarCalc = require('solar-calc');

// SolarCalc(date,lat,long)
var solar = new SolarCalc(new Date('Mar 8 2015'),35.78,-78.649999);

solar.sunrise // 2015-03-08T11:35:30.000Z
```
### SolarCalc functions
each returns a `Date` object

| Property          | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `sunrise()`       | sunrise (top edge of the sun appears on the horizon)                     |
| `sunriseEnd()`    | sunrise ends (bottom edge of the sun touches the horizon)                |
| `goldenHourEnd()` | morning golden hour (soft light, best time for photography) ends         |
| `solarNoon()`     | solar noon (sun is in the highest position)                              |
| `goldenHour()`    | evening golden hour starts                                               |
| `sunsetStart()`   | sunset starts (bottom edge of the sun touches the horizon)               |
| `sunset()`        | sunset (sun disappears below the horizon, evening civil twilight starts) |
| `dusk()`          | dusk (evening nautical twilight starts)                                  |
| `nauticalDusk()`  | nautical dusk (evening astronomical twilight starts)                     |
| `night()`         | night starts (dark enough for astronomical observations)                 |
| `nightEnd()`      | night ends (morning astronomical twilight starts)                        |
| `nauticalDawn()`  | nautical dawn (morning nautical twilight starts)                         |
| `dawn()`          | dawn (morning nautical twilight ends, morning civil twilight starts)     |

Gladly accepting pull requests!
