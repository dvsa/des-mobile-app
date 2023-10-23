import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ColourEnum } from '@pages/examiner-stats/examiner-stats.page';

@Component({
  selector: 'colour-filter-radio',
  templateUrl: 'colour-filter-radio.html',
})
export class ColourFilterRadioComponent implements OnChanges {

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  filterChange = new EventEmitter<ColourEnum>();

  public formControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('Both');
      this.formGroup.addControl('colourFilter', this.formControl);
    }
    this.formControl.patchValue('Default');
  }

  viewFilterChanged(viewFilter: ColourEnum): void {
    if (this.formControl.valid) {
      this.filterChange.emit(viewFilter);
    }
  }
}
