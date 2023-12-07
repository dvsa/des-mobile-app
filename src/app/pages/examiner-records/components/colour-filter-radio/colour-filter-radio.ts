import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ColourEnum } from '@pages/examiner-records/examiner-records.page';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

@Component({
  selector: 'colour-filter-radio',
  templateUrl: 'colour-filter-radio.html',
})
export class ColourFilterRadioComponent implements OnChanges {

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  colourScheme: ColourEnum = ColourEnum.Default;

  @Output()
  filterChange = new EventEmitter<ColourEnum>();

  public formControl: UntypedFormControl;
  constructor(public accessibilityService: AccessibilityService) {
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(this.colourScheme);
      this.formGroup.addControl('colourFilter', this.formControl);
    }
    this.formControl.patchValue(this.colourScheme);
  }

  viewFilterChanged(viewFilter: ColourEnum): void {
    if (this.formControl.valid) {
      this.filterChange.emit(viewFilter);
    }
  }
}
