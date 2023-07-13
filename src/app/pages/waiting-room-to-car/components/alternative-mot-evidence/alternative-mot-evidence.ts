import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

enum AltEvidenceProvided {
  YES = 'alt-mot-evidence-yes',
  NO = 'alt-mot-evidence-no',
}

@Component({
  selector: 'alternative-mot-evidence-provided',
  templateUrl: 'alternative-mot-evidence.html',
})
export class AlternativeMotEvidence {
  @Input()
  alternativeMotEvidence: boolean;

  @Input()
  formGroup: FormGroup;

  @Output()
  alternativeMotEvidenceChange = new EventEmitter<boolean>();

  private formControl: FormControl = null;
  static readonly fieldName: string = 'alternativeMotEvidence';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl(null, [Validators.required]);
      this.formGroup.addControl(AlternativeMotEvidence.fieldName, this.formControl);
    }

    this.formControl.updateValueAndValidity();

    if (this.alternativeMotEvidence !== undefined) {
      this.formControl.patchValue(this.alternativeMotEvidence, {
        onlySelf: true,
        emitEvent: false,
      });
    }
  }

  alternativeMotEvidenceChanged(evidence: string): void {
    if (this.formControl.valid) {
      this.alternativeMotEvidenceChange.emit(evidence === AltEvidenceProvided.YES);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
