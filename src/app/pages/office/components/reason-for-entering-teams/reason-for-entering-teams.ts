
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'reason-for-entering-teams',
  templateUrl: 'reason-for-entering-teams.html',
  imports: [IonicModule, ReactiveFormsModule, DirectivesModule],
})
export class ReasonForEnteringTeamsComponent implements OnChanges {
  @Input()
  display: boolean;

  @Input()
  reasonForOpeningTeams: string;

  @Input()
  formGroup: UntypedFormGroup;

  @Output()
  reasonForOpeningTeamsChange = new EventEmitter<string>();

  formControl: UntypedFormControl;
  readonly fieldName: string = 'reasonForOpeningTeams';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      if (this.formGroup.contains(this.fieldName)) {
        this.formControl.patchValue(this.formGroup.controls[this.fieldName].value);
        this.formGroup.setControl(this.fieldName, this.formControl);
      } else {
        this.formGroup.addControl(this.fieldName, this.formControl);
      }
    }
    if (this.reasonForOpeningTeams) {
      this.formControl.patchValue(this.reasonForOpeningTeams);
    }
  }

  reasonForOpeningTeamsChanged(newReason: string): void {
    this.reasonForOpeningTeamsChange.emit(newReason);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }
}
