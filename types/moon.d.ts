export default class Moon {
  julianDate: number;
  date: Date;
  latitude: number;
  longitude: number;
  readonly illuminosity: number;
  readonly distance: number;
  constructor(date: Date, latitude: number, longitude: number);
}
