import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

enum DeclarationSigned {
  YES = 'Y',
  NO = 'N',
}

@Component({
  selector: 'candidate-declaration-signed',
  templateUrl: 'candidate-declaration.html',
})
export class CandidateDeclarationSignedComponent {

  @Input()
  declarationSelected: boolean;

  @Input()
  candidateSigned: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  formControl: UntypedFormControl;

  @Output()
  candidateDeclarationChange = new EventEmitter<boolean>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null, [Validators.required]);
      this.formGroup.addControl('candidateDeclarationCtrl', this.formControl);
    }

    if (this.candidateSigned) {
      this.formControl.patchValue(this.declarationSelected ? DeclarationSigned.YES : DeclarationSigned.NO);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  candidateDeclarationChanged(declarationSelected: string): void {
    if (this.formControl.valid) {
      this.candidateDeclarationChange.emit(declarationSelected === DeclarationSigned.YES);
    }
  }

}
