export default class Sun {
  julianDate: number;
  date: Date;
  latitude: number;
  longitude: number;
  readonly solarNoon: Date;
  constructor(date: Date, latitude: number, longitude: number);
  timeAtAngle(angle, rising): Date | "error";
}
