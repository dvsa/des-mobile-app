import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { WeatherConditions } from '@dvsa/mes-test-schema/categories/common';
import { WeatherConditionSelection } from '@providers/weather-conditions/weather-conditions.model';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';

@Component({
  selector: 'weather-conditions',
  templateUrl: 'weather-conditions.html',
  styleUrls: ['weather-conditions.scss'],
})
export class WeatherConditionsComponent implements OnChanges {

  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  weatherConditions: WeatherConditions[];

  @Input()
  weatherConditionsOptions: WeatherConditionSelection[];

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  weatherConditionsChange = new EventEmitter<WeatherConditions[]>();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'weatherConditions';

  constructor(public outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl([]);
      this.formGroup.addControl(WeatherConditionsComponent.fieldName, this.formControl);
    }
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome,
      WeatherConditionsComponent.fieldName);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(WeatherConditionsComponent.fieldName).clearValidators();
    } else {
      this.formGroup.get(WeatherConditionsComponent.fieldName).setValidators([Validators.required]);
    }

    this.formControl.patchValue(this.weatherConditions);
  }

  weatherConditionsChanged(weatherConditions: WeatherConditions[]): void {
    this.weatherConditionsChange.emit(weatherConditions);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
