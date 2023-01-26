import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';

@Component({
  selector: 'route-number',
  templateUrl: 'route-number.html',
})
export class RouteNumberComponent implements OnChanges {

  @Input()
  display: boolean;

  @Input()
  outcome: string;

  @Input()
  routeNumber: number;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  routeNumberChange = new EventEmitter<number>();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'routeNumber';

  constructor(public outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(RouteNumberComponent.fieldName, this.formControl);
    }

    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome,
      RouteNumberComponent.fieldName);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(RouteNumberComponent.fieldName).clearValidators();
    } else {
      this.formGroup.get(RouteNumberComponent.fieldName).setValidators([
        Validators.required, Validators.min(1), Validators.max(99), Validators.pattern(/^[0-9]*$/)]);
    }
    this.formControl.patchValue(this.routeNumber);
  }

  routeNumberChanged(routeNumber: string): void {
    this.routeNumberChange.emit(Number.parseInt(routeNumber, 10) || null);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
