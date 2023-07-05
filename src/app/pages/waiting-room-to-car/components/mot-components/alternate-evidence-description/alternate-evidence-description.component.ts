import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'alternate-evidence-description',
  templateUrl: './alternate-evidence-description.component.html',
  styleUrls: ['./alternate-evidence-description.component.scss'],
})
export class AlternateEvidenceDescriptionComponent {

  formControl: UntypedFormControl;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  evidenceDescriptionTestResultChange = new EventEmitter<string>();

  evidenceDescription: string;

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formGroup.addControl('evidenceDescriptionCtrl', this.formControl);
    }
    this.formControl.patchValue(this.evidenceDescription);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  evidenceDescriptionTestResultChanged(event: string) {
    this.evidenceDescriptionTestResultChange.emit(event);
  }

}
