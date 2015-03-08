# solarcalc [![Build Status](https://travis-ci.org/jonhester/solarcalc.svg)](https://travis-ci.org/jonhester/solarcalc/builds)
A sunrise and sunset calculator for npm based on the NOAA Solar Calculator.

```js
var SolarCalc = require('solar-calc');

// SolarCalc(date,lat,long)
var solar = new SolarCalc(new Date('Jun 23 2015'),35.78,-78.649999);

// sunrise in utc
solar.sunrise // 2015-03-08T11:35:30.000Z
```
