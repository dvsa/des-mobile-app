import {
  Component, Input, Output, EventEmitter, OnChanges,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'ipad-issue',
  templateUrl: 'ipad-issue.html',
})
export class IpadIssueComponent implements OnChanges {

  static readonly checkBoxCtrl: string = 'ipadIssueSelected';
  static readonly technicalFaultCtrl: string = 'ipadIssueTechnicalFault';
  static readonly lostCtrl: string = 'ipadIssueLost';
  static readonly stolenCtrl: string = 'ipadIssueStolen';
  static readonly brokenCtrl: string = 'ipadIssueBroken';

  @Input()
  selected: boolean;

  @Input()
  technicalFault: boolean;

  @Input()
  lost: boolean;

  @Input()
  stolen: boolean;

  @Input()
  broken: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  selectedChange = new EventEmitter<boolean>();

  @Output()
  technicalFaultChange = new EventEmitter<boolean>();

  @Output()
  lostChange = new EventEmitter<boolean>();

  @Output()
  stolenChange = new EventEmitter<boolean>();

  @Output()
  brokenChange = new EventEmitter<boolean>();

  private checkBoxFormControl: FormControl;
  private technicalFaultFormControl: FormControl;
  private lostFormControl: FormControl;
  private stolenFormControl: FormControl;
  private brokenFormControl: FormControl;

  ngOnChanges(): void {
    if (!this.checkBoxFormControl) {
      this.checkBoxFormControl = new FormControl(null);
      this.formGroup.addControl(IpadIssueComponent.checkBoxCtrl, this.checkBoxFormControl);
    }

    if (!this.technicalFaultFormControl) {
      this.technicalFaultFormControl = new FormControl(null);
      this.formGroup.addControl(IpadIssueComponent.technicalFaultCtrl, this.technicalFaultFormControl);
    }

    if (!this.lostFormControl) {
      this.lostFormControl = new FormControl(null);
      this.formGroup.addControl(IpadIssueComponent.lostCtrl, this.lostFormControl);
    }

    if (!this.stolenFormControl) {
      this.stolenFormControl = new FormControl(null);
      this.formGroup.addControl(IpadIssueComponent.stolenCtrl, this.stolenFormControl);
    }

    if (!this.brokenFormControl) {
      this.brokenFormControl = new FormControl(null);
      this.formGroup.addControl(IpadIssueComponent.brokenCtrl, this.brokenFormControl);
    }

    this.checkBoxFormControl.patchValue(!!this.selected);
    this.technicalFaultFormControl.patchValue(this.technicalFault);
    this.lostFormControl.patchValue(this.lost);
    this.stolenFormControl.patchValue(this.stolen);
    this.brokenFormControl.patchValue(this.broken);
  }

  selectedValueChanged(selected: boolean): void {
    if (!selected) {
      this.formGroup.get(IpadIssueComponent.technicalFaultCtrl).reset();
      this.formGroup.get(IpadIssueComponent.lostCtrl).reset();
      this.formGroup.get(IpadIssueComponent.stolenCtrl).reset();
      this.formGroup.get(IpadIssueComponent.brokenCtrl).reset();
    }
    this.selectedChange.emit(selected);
  }

  technicalFaultSelected(): void {
    this.technicalFaultChange.emit(true);
  }

  lostSelected(): void {
    this.lostChange.emit(true);
  }

  stolenSelected(): void {
    this.stolenChange.emit(true);
  }

  brokenSelected(): void {
    this.brokenChange.emit(true);
  }

}
