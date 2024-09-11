import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'alternate-mot-evidence-description',
  templateUrl: './alternate-mot-evidence-description.component.html',
  styleUrls: ['./alternate-mot-evidence-description.component.scss'],
})
export class AlternateEvidenceDescriptionComponent {
  formControl: UntypedFormControl;

  @Input()
  shouldHaveSeparator = false;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  evidenceDescriptionTestResultChange = new EventEmitter<string>();

  evidenceDescription: string;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      if (this.formGroup.contains('evidenceDescriptionCtrl')) {
        this.formControl.patchValue(this.formGroup.controls['evidenceDescriptionCtrl'].value);
        this.formGroup.setControl('evidenceDescriptionCtrl', this.formControl);
      } else {
        this.formGroup.addControl('evidenceDescriptionCtrl', this.formControl);
      }
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  evidenceDescriptionTestResultChanged(event: string) {
    this.evidenceDescriptionTestResultChange.emit(event);
  }
}
