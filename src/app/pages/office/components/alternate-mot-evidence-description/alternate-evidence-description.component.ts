import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CharacterCountService } from '@providers/character-count/character-count.service';

@Component({
    selector: 'alternate-mot-evidence-description',
    templateUrl: './alternate-mot-evidence-description.component.html',
    styleUrls: ['./alternate-mot-evidence-description.component.scss'],
    standalone: false
})
export class AlternateEvidenceDescriptionComponent {
  formControl: UntypedFormControl;

  charsRemaining = 0;

  characterLimit = 950;

  @Input()
  shouldHaveSeparator = false;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  alternateEvidenceDescription: string;

  @Output()
  evidenceDescriptionTestResultChange = new EventEmitter<string>();

  constructor(public characterCountService: CharacterCountService) {}

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required, this.charactersExceededValidator()]);
      this.formControl.patchValue(this.alternateEvidenceDescription);
      if (this.formGroup.contains('altEvidenceDetailsCtrl')) {
        this.formGroup.setControl('altEvidenceDetailsCtrl', this.formControl);
      } else {
        this.formGroup.addControl('altEvidenceDetailsCtrl', this.formControl);
      }
    }
  }

  charactersExceededValidator(): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.characterCountService.charactersExceeded(this.charsRemaining) ? { charactersExceeded: true } : null;
    };
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  /**
   * Request whether the character count has been exceeded
   */
  charactersExceeded(): boolean {
    return this.characterCountService.charactersExceeded(this.charsRemaining);
  }

  characterCountChanged(charactersRemaining: number) {
    this.charsRemaining = charactersRemaining;
    this.formGroup.get('altEvidenceDetailsCtrl').updateValueAndValidity();
  }

  /**
   * Request appropriate character count text based upon how many characters are remaining
   */
  getCharacterCountText(): string {
    return this.characterCountService.getCharacterCountText(this.charsRemaining);
  }

  evidenceDescriptionTestResultChanged(event: string) {
    this.evidenceDescriptionTestResultChange.emit(event);
  }
}
