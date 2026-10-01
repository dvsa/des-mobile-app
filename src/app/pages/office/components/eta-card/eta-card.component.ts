import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ETA } from '@dvsa/mes-test-schema/categories/common';
import { CharacterCountService } from '@providers/character-count/character-count.service';

@Component({
  selector: 'eta-card',
  templateUrl: './eta-card.component.html',
  styleUrls: ['./eta-card.component.scss'],
  standalone: false,
})
export class ETACardComponent {
  commentMaxLength = 950;

  @Input()
  faults: ETA;
  @Input()
  formGroup: UntypedFormGroup;
  @Input()
  footbrakeETA: boolean;
  @Input()
  handbrakeETA: boolean;
  @Input()
  otherETA: boolean;
  @Input()
  otherETAReason: string;
  @Input()
  steeringETA: boolean;

  @Input()
  shouldShowDetailCheckboxes = true;

  @Output()
  footbrakeETAChanged = new EventEmitter();
  @Output()
  handbrakeETAChanged = new EventEmitter();
  @Output()
  otherETAChanged = new EventEmitter();
  @Output()
  otherETATextChanged = new EventEmitter<string>();
  @Output()
  steeringETAChanged = new EventEmitter();

  charsRemaining: number = null;
  formControl: UntypedFormControl;
  readonly fieldName: string = 'etaPhysicalOtherText';

  constructor(public characterCountService: CharacterCountService) {}

  footbrakeETAChange() {
    this.footbrakeETAChanged.emit();
  }

  handbrakeETAChange() {
    this.handbrakeETAChanged.emit();
  }

  otherETAChange() {
    this.otherETAChanged.emit();
  }

  otherETATextChange(newOther: string) {
    this.otherETATextChanged.emit(newOther);
  }

  steeringETAChange() {
    this.steeringETAChanged.emit();
  }

  readonly etaTypeRequiredField = 'etaPhysicalTypeSelected';
  etaTypeRequiredControl: UntypedFormControl;

  get etaTypeInvalid(): boolean {
    return !!this.etaTypeRequiredControl?.invalid && !!this.etaTypeRequiredControl?.dirty;
  }

  ngOnChanges(): void {
    if (this.shouldShowDetailCheckboxes && this.isPhysicalFault()) {
      if (!this.formControl) {
        this.formControl = new UntypedFormControl();
        if (this.formGroup.contains(this.fieldName)) {
          this.formControl.patchValue(this.formGroup.controls[this.fieldName].value);
          this.formGroup.setControl(this.fieldName, this.formControl);
        } else {
          this.formGroup.addControl(this.fieldName, this.formControl);
        }
      }

      this.formControl.setValidators(this.otherETA ? [Validators.required, this.charactersExceededValidator()] : []);
      this.formControl.updateValueAndValidity();

      this.formControl.patchValue(this.otherETAReason ?? '');

      if (!this.etaTypeRequiredControl) {
        this.etaTypeRequiredControl = new UntypedFormControl(false, Validators.requiredTrue);

        if (this.formGroup.contains(this.etaTypeRequiredField)) {
          this.formGroup.setControl(this.etaTypeRequiredField, this.etaTypeRequiredControl);
        } else {
          this.formGroup.addControl(this.etaTypeRequiredField, this.etaTypeRequiredControl);
        }
      }

      const hasSelectedEtaType = !!(this.steeringETA || this.handbrakeETA || this.footbrakeETA || this.otherETA);

      this.etaTypeRequiredControl.patchValue(hasSelectedEtaType, { emitEvent: false });
      this.etaTypeRequiredControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  getETAFaultText(): string {
    if (!this.faults || (!this.faults.physical && !this.faults.verbal)) return '';
    if (this.faults.physical && !this.faults.verbal) return 'Physical';
    if (!this.faults.physical && this.faults.verbal) return 'Verbal';
    if (this.faults.physical && this.faults.verbal) return 'Physical and verbal';
  }

  isPhysicalFault(): boolean {
    return this.faults?.physical ?? false;
  }

  shouldDisplay(): boolean {
    return this.faults?.physical || this.faults?.verbal;
  }

  get invalid(): boolean {
    if (!this.formControl) {
      return false;
    }
    return !this.formControl.valid && this.formControl.dirty;
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
    };
  }

  /**
   * Request appropriate character count text based upon how many characters are remaining
   */
  getCharacterCountText(): string {
    return this.characterCountService.getCharacterCountText(this.charsRemaining);
  }

  /**
   * Update the character count and revalidate the form control
   * @param charactersRemaining
   */
  characterCountChanged(charactersRemaining: number) {
    this.charsRemaining = charactersRemaining;
    this.formControl?.updateValueAndValidity();
  }

  /**
   * Request whether the character count has been exceeded
   */
  charactersExceeded(): boolean {
    return this.characterCountService.charactersExceeded(this.charsRemaining);
  }
}
