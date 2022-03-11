import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Combination } from '@shared/constants/cpc-questions/cpc-question-combinations.constants';

@Component({
  selector: 'combination',
  templateUrl: 'combination.html',
  styleUrls: ['combination.scss'],
})
export class CombinationComponent {

  @Input()
  formGroup: FormGroup;

  @Input()
  combinations: Combination[];

  @Input()
  combination: string;

  @Output()
  combinationChange = new EventEmitter();

  private formControl: FormControl;

  static readonly fieldName: string = 'combination';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
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
