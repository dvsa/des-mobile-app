import { ComponentsModule } from '@components/common/common-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HighwayCodeSafetyComponent } from '@pages/test-report/components/highway-code-safety/highway-code-safety';
import { EtaComponent } from './examiner-takes-action/eta';
import { CompetencyComponent } from './competency/competency';
import { CompetencyButtonComponent } from './competency-button/competency-button';
import { DrivingFaultSummaryComponent } from './driving-fault-summary/driving-fault-summary';
import { ToolbarComponent } from './toolbar/toolbar';
import { SeriousTooltipComponent } from './serious-tooltip/serious-tooltip';
import { DangerousTooltipComponent } from './dangerous-tooltip/dangerous-tooltip';
import { LegalRequirementComponent } from './legal-requirement/legal-requirement';
import { EcoComponent } from './eco/eco';
import { TimerComponent } from './timer/timer';
import { EndTestModalModule } from './end-test-modal/end-test-modal.module';
import { LegalRequirementsModalModule } from './legal-requirements-modal/legal-requirements-modal.module';
import { EtaInvalidModalModule } from './eta-invalid-modal/eta-invalid-modal.module';
import { ManoeuvreCompetencyComponent } from './manoeuvre-competency/manoeuvre-competency';
import { UncoupleRecoupleComponent } from './uncouple-recouple/uncouple-recouple';
import { MultiLegalRequirementComponent } from './multi-legal-requirement/multi-legal-requirement';
import { SingleFaultCompetencyComponent } from './single-fault-competency/single-fault-competency';
import { ControlledStopComponent } from './controlled-stop/controlled-stop';
import {
  SpecialLegalRequirementModalModule,
} from './special-legal-requirement-modal/special-legal-requirement-modal.module';
import {
  TestFinalisationInvalidTestDataModalModule,
} from './test-finalisation-invalid-test-data-modal/test-finalisation-invalid-test-data-modal.module';

@NgModule({
  declarations: [
    EtaComponent,
    CompetencyComponent,
    SingleFaultCompetencyComponent,
    CompetencyButtonComponent,
    ManoeuvreCompetencyComponent,
    DrivingFaultSummaryComponent,
    ToolbarComponent,
    SeriousTooltipComponent,
    DangerousTooltipComponent,
    LegalRequirementComponent,
    MultiLegalRequirementComponent,
    EcoComponent,
    TimerComponent,
    UncoupleRecoupleComponent,
    ControlledStopComponent,
    HighwayCodeSafetyComponent,
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    IonicModule,
    EndTestModalModule,
    LegalRequirementsModalModule,
    SpecialLegalRequirementModalModule,
    EtaInvalidModalModule,
    TestFinalisationInvalidTestDataModalModule,
  ],
  exports: [
    EtaComponent,
    CompetencyComponent,
    SingleFaultCompetencyComponent,
    CompetencyButtonComponent,
    ManoeuvreCompetencyComponent,
    DrivingFaultSummaryComponent,
    ToolbarComponent,
    SeriousTooltipComponent,
    DangerousTooltipComponent,
    LegalRequirementComponent,
    MultiLegalRequirementComponent,
    EcoComponent,
    TimerComponent,
    UncoupleRecoupleComponent,
    ControlledStopComponent,
    HighwayCodeSafetyComponent,
  ],
})
export class TestReportComponentsModule {}
