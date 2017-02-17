import { moonPhase, moonPos } from './moonUtils';

class Moon {
  constructor(date, latitude, longitude) {
    this.date = date;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  get illuminosity() {
    return moonPhase(this.date) / 360;
  }

  get distance() {
    return moonPos(this.date).distance;
  }
}

module.exports = Moon;
