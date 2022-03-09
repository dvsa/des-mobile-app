import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { VehicleChecksCompactCatDComponent } from './vehicle-checks-compact/vehicle-checks-compact.cat-d';
import { SafetyQuestionsCatDComponent } from './safety-questions/safety-questions.cat-d';
import { PcvDoorExerciseComponent } from './pcv-door-exercise/pcv-door-exercise';

@NgModule({
  declarations: [
    VehicleChecksCompactCatDComponent,
    SafetyQuestionsCatDComponent,
    PcvDoorExerciseComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    TestReportComponentsModule,
    IonicModule,
    DirectivesModule,
  ],
  exports: [
    VehicleChecksCompactCatDComponent,
    SafetyQuestionsCatDComponent,
    PcvDoorExerciseComponent,
  ],
})
export class TestReportCatDComponentsModule { }
