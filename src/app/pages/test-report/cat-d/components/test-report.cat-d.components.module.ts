import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { PcvDoorExerciseComponent } from './pcv-door-exercise/pcv-door-exercise';
import { SafetyQuestionsCatDComponent } from './safety-questions/safety-questions.cat-d';
import { VehicleChecksCompactCatDComponent } from './vehicle-checks-compact/vehicle-checks-compact.cat-d';

@NgModule({
  imports: [
    CommonModule,
    TestReportComponentsModule,
    VehicleChecksCompactCatDComponent,
    SafetyQuestionsCatDComponent,
    PcvDoorExerciseComponent,
  ],
  exports: [VehicleChecksCompactCatDComponent, SafetyQuestionsCatDComponent, PcvDoorExerciseComponent],
})
export class TestReportCatDComponentsModule {}
