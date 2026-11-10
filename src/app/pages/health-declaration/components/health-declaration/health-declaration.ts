import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { IonCol, IonRow } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'health-declaration',
  templateUrl: 'health-declaration.html',
  styleUrls: ['health-declaration.scss'],
  imports: [IonRow, IonCol, AddOrRemoveLangCyDirective, FormsModule, ReactiveFormsModule, TranslatePipe],
})
export class HealthDeclarationComponent implements OnChanges {
  @Input()
  selected: boolean;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  healthDeclarationChange = new EventEmitter();

  formControl: UntypedFormControl;
  static readonly fieldName: string = 'healthCheckbox';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', []);
      this.formGroup.addControl(HealthDeclarationComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.selected);
  }

  healthDeclarationChanged(isChecked: boolean): void {
    this.healthDeclarationChange.emit(isChecked);
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
