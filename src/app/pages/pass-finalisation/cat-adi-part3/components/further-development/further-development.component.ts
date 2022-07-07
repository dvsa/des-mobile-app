import {
  Component, Input, OnChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'further-development',
  templateUrl: './further-development.component.html',
  styleUrls: ['./further-development.component.scss'],
})
export class FurtherDevelopmentComponent implements OnChanges {

  noAdviceCharsRemaining: number = null;
  adviceGiven: boolean = null;
  @Input() formGroup?: FormGroup;
  formControl: FormControl = null;

  ngOnChanges() {
    console.log(this.formGroup);
    this.allocateFormControl();
  }

  characterCountChanged(charactersRemaining: number) {
    console.log(charactersRemaining);
    this.noAdviceCharsRemaining = charactersRemaining;
  }

  allocateFormControl() {
    if (!this.formControl && this.formGroup) {
      this.formControl = new FormControl('', [Validators.required]);
      console.log(this.formControl);
      this.formGroup.addControl('furtherDevelopment', this.formControl);
    }
  }

  furtherDevelopmentChanged(furtherDevelopment) {
    if (furtherDevelopment === 'further-development-yes') {
      this.adviceGiven = true;
    } else {
      this.adviceGiven = false;
    }
    console.log(this.adviceGiven);
  }

  charactersExceeded(): boolean {
    return this.noAdviceCharsRemaining < 0;
  }

  getCharacterCountText() {
    const characterString = Math.abs(this.noAdviceCharsRemaining) === 1 ? 'character' : 'characters';
    const endString = this.noAdviceCharsRemaining < 0 ? 'too many' : 'remaining';
    console.log(`You have ${Math.abs(this.noAdviceCharsRemaining)} ${characterString} ${endString}`);
    return `You have ${Math.abs(this.noAdviceCharsRemaining)} ${characterString} ${endString}`;
  }

}
