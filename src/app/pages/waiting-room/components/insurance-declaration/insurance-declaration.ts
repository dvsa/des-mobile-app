import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';

@Component({
  selector: 'insurance-declaration',
  templateUrl: 'insurance-declaration.html',
  styleUrls: ['insurance-declaration.scss'],
  imports: [IonRow, IonCol, AddOrRemoveLangCyDirective, FormsModule, ReactiveFormsModule, TranslatePipe],
})
export class InsuranceDeclarationComponent implements OnChanges {
  @Input()
  selected: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  insuranceDeclarationChange = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'insuranceCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.requiredTrue]);

      this.formGroup.addControl(InsuranceDeclarationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.selected);
  }

  insuranceDeclarationChanged(selected: boolean): void {
    this.insuranceDeclarationChange.emit(selected);
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
