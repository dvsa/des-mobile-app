import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'reason-for-entering-teams',
  templateUrl: 'reason-for-entering-teams.html',
  imports: [IonicModule, ReactiveFormsModule, DirectivesModule, NgIf],
  standalone: true,
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
  static readonly fieldName: string = 'reasonForOpeningTeams';

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl(null);
      this.formGroup.addControl(ReasonForEnteringTeamsComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.reasonForOpeningTeams);
  }

  additionalInformationChanged(newReason: string): void {
    this.reasonForOpeningTeamsChange.emit(newReason);
  }
}
