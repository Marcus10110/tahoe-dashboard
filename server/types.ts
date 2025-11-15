export interface SnowDepth {
  base: number;
  summit: number;
  newSnow24h: number;
  newSnow48h?: number;
  newSnow7day?: number;
  seasonTotal?: number;
}

export interface Weather {
  current: string;
  temp: number;
  high: number;
  low: number;
  wind?: string;
}

export interface LiftStatus {
  open: number;
  total: number;
  status?: string;
}

export interface TrailStatus {
  open: number;
  total: number;
}

export interface Forecast {
  date: string;
  name: string;
  high: number;
  low: number;
  conditions: string;
  snowfall?: number;
  precipChance?: number;
}

export interface ResortConditions {
  name: string;
  id: string;
  conditions: {
    snowDepth: SnowDepth;
    weather: Weather;
    lifts: LiftStatus;
    trails?: TrailStatus;
  };
  forecasts: {
    today: Forecast;
    thisWeekend: Forecast[];
    nextWeekend: Forecast[];
  };
  lastUpdated: string;
}

export interface TravelRoute {
  name: string;
  highway: string;
  status: string;
  description?: string;
  incidents?: string[];
}

export interface TravelConditions {
  routes: TravelRoute[];
  lastUpdated: string;
}
