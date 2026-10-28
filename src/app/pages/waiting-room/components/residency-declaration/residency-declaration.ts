import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AddOrRemoveLangCyDirective } from '../../../../../directives/add-or-remove-lang-cy.directive';

@Component({
  selector: 'residency-declaration',
  templateUrl: 'residency-declaration.html',
  styleUrls: ['residency-declaration.scss'],
  imports: [IonRow, IonCol, AddOrRemoveLangCyDirective, FormsModule, ReactiveFormsModule, TranslatePipe],
})
export class ResidencyDeclarationComponent implements OnChanges {
  @Input()
  selected: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  residencyDeclarationChange = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'residencyCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.requiredTrue]);

      this.formGroup.addControl(ResidencyDeclarationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.selected);
  }

  residencyDeclarationChanged(selected: boolean): void {
    this.residencyDeclarationChange.emit(selected);
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
