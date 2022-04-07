import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModeOfTransport } from '@dvsa/mes-test-schema/categories/AM2';
import {
  OutcomeBehaviourMapProvider,
  VisibilityType,
} from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { removeNonAlphaNumeric } from '@shared/helpers/formatters';

@Component({
  selector: 'mode-of-transport',
  templateUrl: 'mode-of-transport.cat-a-mod2.html',
})
export class ModeOfTransportCatAMod2Component implements OnChanges {
  @Input()
  outcome: string;

  @Input()
  option1: ModeOfTransport;

  @Input()
  option2: ModeOfTransport;

  @Input()
  option1label: string;

  @Input()
  option2label: string;

  @Input()
  modeOfTransport: ModeOfTransport;

  @Input()
  formGroup: FormGroup;

  @Output()
  modeOfTransportChange = new EventEmitter<ModeOfTransport>();

  showNotApplicable: boolean;
  private formControl: FormControl;
  static readonly fieldName: string = 'modeOfTransport';
  constructor(private outcomeBehaviourProvider: OutcomeBehaviourMapProvider) { }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null);
      this.formGroup.addControl('modeOfTransport', this.formControl);
    }
    this.showNotApplicable = this.outcomeBehaviourProvider.showNotApplicable(this.outcome,
      ModeOfTransportCatAMod2Component.fieldName);
    const visibilityType = this.outcomeBehaviourProvider.getVisibilityType(this.outcome,
      ModeOfTransportCatAMod2Component.fieldName);

    if (visibilityType === VisibilityType.NotVisible) {
      this.formGroup.get(ModeOfTransportCatAMod2Component.fieldName).clearValidators();
    } else {
      this.formGroup.get(ModeOfTransportCatAMod2Component.fieldName).setValidators([Validators.required]);
    }

    this.formControl.patchValue(this.modeOfTransport);
  }

  modeOfTransportChanged(modeOfTransport: ModeOfTransport): void {
    if (this.formControl.valid) {
      this.modeOfTransportChange.emit(modeOfTransport);
    }
  }

  getModeOfTransportInputId(inputLabel: string): string {
    return `mode-of-transport-${removeNonAlphaNumeric(inputLabel).toLowerCase()}`;
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
