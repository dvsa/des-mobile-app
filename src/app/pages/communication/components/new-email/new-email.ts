import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonCol, IonInput, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { emailValidator } from '@providers/custom-validators/custom-validators';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';
import { EmojiBlockDirective } from '../../../../../directives/emoji-block.directive';
import { PasteSanitiserDirective } from '../../../../../directives/paste-sanitiser';

@Component({
  selector: 'new-email',
  templateUrl: 'new-email.html',
  styleUrls: ['new-email.scss'],
  imports: [
    IonRow,
    FormsModule,
    ReactiveFormsModule,
    AddOrRemoveLangCyDirective,
    IonCol,
    IonInput,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    TranslatePipe,
  ],
})
export class NewEmailComponent implements OnChanges {
  static readonly newEmail: string = 'newEmail';
  static readonly newEmailCtrl: string = 'newEmailCtrl';
  static readonly radioCtrl: string = 'radioCtrl';

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  newEmailAddress: string;

  @Input()
  isNewEmailAddressChosen: boolean;

  @Output()
  newEmailRadioSelect = new EventEmitter<string>();

  @Output()
  newEmailTextChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  radioButtonControl: UntypedFormControl;

  ngOnChanges(): void {
    if (!this.radioButtonControl) {
      this.radioButtonControl = new UntypedFormControl('', Validators.required);
      this.formGroup.addControl(NewEmailComponent.radioCtrl, this.radioButtonControl);
    }

    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', Validators.required);
      if (this.isNewEmailAddressChosen) {
        this.formControl.setValidators(Validators.compose([Validators.required, emailValidator()]));
      }
      this.formGroup.addControl(NewEmailComponent.newEmailCtrl, this.formControl);
    }
    this.formControl.patchValue(this.newEmailAddress);
    this.radioButtonControl.patchValue(!!this.isNewEmailAddressChosen);
  }

  newEmailRadioSelected() {
    this.newEmailRadioSelect.emit(NewEmailComponent.newEmail);
  }

  newEmailTextChanged(email: string) {
    if (this.formControl.valid) {
      this.newEmailTextChange.emit(email);
    }
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
