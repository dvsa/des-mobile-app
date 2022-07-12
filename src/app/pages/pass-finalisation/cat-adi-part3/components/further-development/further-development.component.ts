import {
  Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'further-development',
  templateUrl: './further-development.component.html',
  styleUrls: ['./further-development.component.scss'],
})
export class FurtherDevelopmentComponent implements OnChanges {

  formControl: FormControl;
  noAdviceCharsRemaining: number = null;

  @Input()
  formGroup: FormGroup;

  @Input()
  furtherDevelopment: boolean;

  @Output()
  furtherDevelopmentChange = new EventEmitter<boolean>();

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);
      this.formGroup.addControl('furtherDevelopment', this.formControl);
    }

    this.formControl.patchValue(this.furtherDevelopment);
  }

  furtherDevelopmentChanged(furtherDevelopment: boolean) {
    if (this.formControl.valid) {
      this.furtherDevelopmentChange.emit(furtherDevelopment);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  // characterCountChanged(charactersRemaining: number) {
  //   console.log(charactersRemaining);
  //   this.noAdviceCharsRemaining = charactersRemaining;
  // }
  //
  // charactersExceeded(): boolean {
  //   return this.noAdviceCharsRemaining < 0;
  // }
  //
  // getCharacterCountText() {
  //   const characterString = Math.abs(this.noAdviceCharsRemaining) === 1 ? 'character' : 'characters';
  //   const endString = this.noAdviceCharsRemaining < 0 ? 'too many' : 'remaining';
  //   console.log(`You have ${Math.abs(this.noAdviceCharsRemaining)} ${characterString} ${endString}`);
  //   return `You have ${Math.abs(this.noAdviceCharsRemaining)} ${characterString} ${endString}`;
  // }

}
