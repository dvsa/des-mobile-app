import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CharacterCountService } from '@providers/character-count/character-count.service';

@Component({
  selector: 'eco-capture-reason',
  templateUrl: 'eco-capture-reason.html',
})
export class EcoCaptureReasonComponent implements OnChanges {
  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  ecoCaptureReason: string;

  @Input()
  fuelEfficientDriving = false;

  @Output()
  ecoCaptureReasonChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  charsRemaining: number = null;
  characterLimit = 1000;
  static readonly controlName: string = 'ecoCaptureReason';

  constructor(public characterCountService: CharacterCountService) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(EcoCaptureReasonComponent.controlName, this.formControl);
    }

    if (this.fuelEfficientDriving) {
      this.formGroup
        .get(EcoCaptureReasonComponent.controlName)
        .setValidators([Validators.required, this.charactersExceededValidator()]);
    } else {
      this.formGroup.get(EcoCaptureReasonComponent.controlName).setValidators([this.charactersExceededValidator()]);
    }

    this.formControl.patchValue(this.ecoCaptureReason);
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
    };
  }

  ecoCaptureReasonChanged(ecoCaptureReason: string): void {
    if (this.formControl.valid) {
      this.ecoCaptureReasonChange.emit(ecoCaptureReason);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  characterCountChanged(charactersRemaining: number) {
    this.charsRemaining = charactersRemaining;
    this.formControl.updateValueAndValidity();
  }

  /**
   * Request appropriate character count text based upon how many characters are remaining
   */
  getCharacterCountText(): string {
    return this.characterCountService.getCharacterCountText(this.charsRemaining);
  }

  /**
   * Request whether the character count has been exceeded
   */
  charactersExceeded(): boolean {
    return this.characterCountService.charactersExceeded(this.charsRemaining);
  }
}
