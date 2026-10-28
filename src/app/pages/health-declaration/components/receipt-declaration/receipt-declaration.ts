import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';

@Component({
  selector: 'receipt-declaration',
  templateUrl: 'receipt-declaration.html',
  styleUrls: ['receipt-declaration.scss'],
  imports: [AddOrRemoveLangCyDirective, IonRow, FormsModule, ReactiveFormsModule, IonCol, TranslatePipe],
})
export class ReceiptDeclarationComponent implements OnChanges {
  @Input()
  selected: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Input()
  certificateNumber: string;

  @Output()
  receiptDeclarationChange = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'receiptCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.requiredTrue]);

      this.formGroup.addControl(ReceiptDeclarationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.selected);
  }

  receiptDeclarationChanged(isSelected: boolean): void {
    this.receiptDeclarationChange.emit(isSelected);
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
