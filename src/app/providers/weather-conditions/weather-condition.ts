import { Injectable } from '@angular/core';
import weatherConditions from './weather-conditions.constants';
import { WeatherConditionSelection } from './weather-conditions.model';

@Injectable()
export class WeatherConditionProvider {
  getWeatherConditions(): WeatherConditionSelection[] {
    return weatherConditions;
  }
}
