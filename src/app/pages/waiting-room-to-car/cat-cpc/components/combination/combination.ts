import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Combination } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';

@Component({
  selector: 'combination',
  templateUrl: 'combination.html',
  styleUrls: ['combination.scss'],
})
export class CombinationComponent {

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  combinations: Combination[];

  @Input()
  combination: string;

  @Output()
  combinationChange = new EventEmitter();

  formControl: UntypedFormControl;

  static readonly fieldName: string = 'combination';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl(CombinationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.combination);
  }

  combinationChanged(combination: string): void {
    this.combinationChange.emit(combination);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}
