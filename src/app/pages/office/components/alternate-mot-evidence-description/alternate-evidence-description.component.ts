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

  @Input()
  alternateEvidenceDescription: string;

  @Output()
  evidenceDescriptionTestResultChange = new EventEmitter<string>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formControl.patchValue(this.alternateEvidenceDescription);
      if (this.formGroup.contains('altEvidenceDetailsCtrl')) {
        this.formGroup.setControl('altEvidenceDetailsCtrl', this.formControl);
      } else {
        console.log('Adding altEvidenceDetailsCtrl to formGroup', this.formControl);
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
