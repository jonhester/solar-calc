# solar-calc [![npm](https://img.shields.io/npm/v/solar-calc.svg)](https://www.npmjs.com/package/solar-calc) [![Build Status](https://travis-ci.org/jonhester/solar-calc.svg)](https://travis-ci.org/jonhester/solar-calc/builds)
A sunrise and sunset calculator for npm based on the NOAA Solar Calculator.

Gladly accepting pull requests!

```js
var SolarCalc = require('solar-calc');

// SolarCalc(date,lat,long)
var solar = new SolarCalc(new Date('Mar 8 2015'),35.78,-78.649999);

solar.sunrise // 2015-03-08T11:35:30.000Z
```
## Properties
All properties are `Date` objects unless otherwise noted

- `sunrise` When the upper edge of the Sun appears over the eastern horizon in the morning (0.833 degrees)

- `sunset` When the upper edge of the Sun disappears below the horizon

- `civilDawn` when there is enough light for objects to be distinguishable. This occurs when the sun is 6 degrees below the horizon in the morning

- `nauticalDawn` When there is enough sunlight for the horizon and some objects to be distinguishable. This occurs when the Sun is 12 degrees below the horizon in the morning

- `astronomicalDawn` when the sky is no longer completely dark. This occurs when the Sun is 18 degrees below the horizon in the morning

- `civilDusk` When the sun is 6 degrees below the horizon in the evening. At this time objects are distinguishable and some stars and planets are visible to the naked eye.

- `nauticalDusk` When the sun is 12 degrees below the horizon in the evening. At this time, objects are no longer distinguishable, and the horizon is no longer visible to the naked eye

- `astronomicalDusk` When the sun is 18 degrees below the horizon in the evening. At this time the sun no longer illuminates the sky, and thus no longer interferes with astronomical observations

- `solarNoon` When the sun transits the celestial meridian – roughly the time when it is highest above the horizon

- `lunarDistance` (integer) the distance from the center of the eart to the center of the moon in kilometers

- `luminosty` (number) the percentage of the moon that is illuminated in decimal form
