import { WeatherConditions } from '@dvsa/mes-test-schema/categories/common';

export interface WeatherConditionSelection {
  weatherConditionNumber: number;
  weatherConditionDescription: WeatherConditions;
}
