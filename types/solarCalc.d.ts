import Sun from './sun';
import Moon from './moon';

export default class SolarCalc {
  date: Date;
  latitude: number;
  longitude: number;
  sun: Sun;
  moon: Moon;
  readonly solarNoon: Date;
  readonly sunrise: Date | "error";
  readonly sunset: Date | "error";
  readonly sunriseEnd: Date | "error";
  readonly sunsetStart: Date | "error";
  readonly civilDawn: Date | "error";
  readonly dawn: Date | "error";
  readonly civilDusk: Date | "error";
  readonly dusk: Date | "error";
  readonly nauticalDawn: Date | "error";
  readonly nauticalDusk: Date | "error";
  readonly nightStart: Date | "error";
  readonly astronomicalDusk: Date | "error";
  readonly astronomicalDawn: Date | "error";
  readonly nightEnd: Date | "error";
  readonly goldenHourStart: Date | "error";
  readonly goldenHourEnd: Date | "error";
  readonly lunarDistance: number;
  readonly lunarIlluminosity: number;
  constructor(date: Date, latitude: number, longitude: number);
}
