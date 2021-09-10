import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { ActivityCodeModel } from './activity-code.constants';

@Component({
  selector: 'activity-code',
  templateUrl: 'activity-code.html',
  styleUrls: ['activity-code.scss'],
})
export class ActivityCodeComponent implements OnChanges {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}
  @Input()
  activityCodeModel: ActivityCodeModel;

  @Input()
  activityCodeOptions: ActivityCodeModel[];

  @Input()
  formGroup: FormGroup;

  @Input()
  disabled: boolean;

  @Output()
  activityCodeChange = new EventEmitter<ActivityCodeModel>();

  private formControl: FormControl;
  static readonly fieldName: string = 'activityCode';

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl({ disabled: true }, [Validators.required]);
      this.formGroup.addControl(ActivityCodeComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.activityCodeModel);
  }

  activityCodeChanged(activityCode: ActivityCodeModel): void {
    if (this.formControl.valid) {
      this.activityCodeChange.emit(activityCode);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  isSelectDisabled(): boolean {
    return this.disabled || (this.activityCodeModel && parseInt(this.activityCodeModel.activityCode, 10) < 4);
  }

  isOptionDisabled(activityCode: ActivityCode): boolean {
    return parseInt(activityCode, 10) < 4;
  }
}
