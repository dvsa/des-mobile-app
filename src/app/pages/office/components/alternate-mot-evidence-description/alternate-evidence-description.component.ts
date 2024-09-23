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
      if (this.formGroup.contains('altEvidenceDetailsCtrl')) {
        this.formControl.patchValue(this.formGroup.controls['altEvidenceDetailsCtrl'].value);
        this.formGroup.setControl('altEvidenceDetailsCtrl', this.formControl);
      } else {
        this.formGroup.addControl('altEvidenceDetailsCtrl', this.formControl);
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
