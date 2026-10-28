import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';
import { IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AddOrRemoveLangCyDirective } from '../../../directives/add-or-remove-lang-cy.directive';
import { SignatureAreaComponent as SignatureAreaComponent_1 } from '../signature-area/signature-area';

@Component({
  selector: 'signature',
  templateUrl: './signature.html',
  styleUrls: ['./signature.scss'],
  imports: [
    IonRow,
    FormsModule,
    ReactiveFormsModule,
    IonCol,
    SignatureAreaComponent_1,
    AddOrRemoveLangCyDirective,
    TranslatePipe,
  ],
})
export class SignatureComponent implements OnChanges {
  @ViewChild(SignatureAreaComponent)
  signatureArea: SignatureAreaComponent;

  @Input()
  signature: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  signatureDataChange = new EventEmitter<string>();

  @Output()
  signatureCleared = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'signature';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.formGroup.addControl(SignatureComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.signature);
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  onClear = (): void => {
    this.signatureCleared.emit();
  };

  onChange = (event: string): void => {
    this.signatureDataChange.emit(event);
  };
}
