import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FilterEnum } from '@pages/examiner-stats/examiner-stats.page';

@Component({
  selector: 'view-filter-radio',
  templateUrl: 'view-filter-radio.html',
})
export class ViewFilterRadioComponent implements OnChanges {

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  filterChange = new EventEmitter<FilterEnum>();

  public formControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('Both');
      this.formGroup.addControl('displayFilter', this.formControl);
    }
    this.formControl.patchValue('Both');
  }

  viewFilterChanged(viewFilter: FilterEnum): void {
    if (this.formControl.valid) {
      this.filterChange.emit(viewFilter);
    }
  }
}