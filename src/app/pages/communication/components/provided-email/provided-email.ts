import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'provided-email',
  templateUrl: 'provided-email.html',
  styleUrls: ['provided-email.scss'],
  imports: [FormsModule, ReactiveFormsModule, IonRow, AddOrRemoveLangCyDirective, IonCol, TranslatePipe],
})
export class ProvidedEmailComponent {
  static readonly providedEmail: string = 'Email';
  static readonly radioCtrl: string = 'radioCtrl';

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  providedEmailAddress: string;

  @Input()
  shouldRender: boolean;

  @Input()
  isProvidedEmailAddressChosen: boolean;

  @Output()
  providedEmailRadioSelect = new EventEmitter<string>();

  radioButtonControl: UntypedFormControl;

  ngOnChanges() {
    if (!this.radioButtonControl) {
      this.radioButtonControl = new UntypedFormControl('', Validators.required);
      this.formGroup.addControl(ProvidedEmailComponent.radioCtrl, this.radioButtonControl);
    }
    this.radioButtonControl.patchValue(!!this.isProvidedEmailAddressChosen);
  }

  providedEmailRadioSelected() {
    this.providedEmailRadioSelect.emit(ProvidedEmailComponent.providedEmail);
  }
}
