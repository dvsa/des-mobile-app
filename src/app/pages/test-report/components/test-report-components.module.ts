import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';

import { HighwayCodeSafetyComponent } from '@pages/test-report/components/highway-code-safety/highway-code-safety';
import { CompetencyButtonComponent } from './competency-button/competency-button';
import { CompetencyComponent } from './competency/competency';
import { ControlledStopComponent } from './controlled-stop/controlled-stop';
import { DangerousTooltipComponent } from './dangerous-tooltip/dangerous-tooltip';
import { DrivingFaultSummaryComponent } from './driving-fault-summary/driving-fault-summary';
import { EcoComponent } from './eco/eco';
import { EndTestModalModule } from './end-test-modal/end-test-modal.module';
import { EtaInvalidModalModule } from './eta-invalid-modal/eta-invalid-modal.module';
import { EtaComponent } from './examiner-takes-action/eta';
import { LegalRequirementComponent } from './legal-requirement/legal-requirement';
import { LegalRequirementsModalModule } from './legal-requirements-modal/legal-requirements-modal.module';
import { ManoeuvreCompetencyComponent } from './manoeuvre-competency/manoeuvre-competency';
import { MultiLegalRequirementComponent } from './multi-legal-requirement/multi-legal-requirement';
import { ReverseDiagramPageModule } from './reverse-diagram-modal/reverse-diagram-modal.module';
import { SeriousTooltipComponent } from './serious-tooltip/serious-tooltip';
import { SingleFaultCompetencyComponent } from './single-fault-competency/single-fault-competency';
import { SpecialLegalRequirementModalModule } from './special-legal-requirement-modal/special-legal-requirement-modal.module';
import { TestFinalisationInvalidTestDataModalModule } from './test-finalisation-invalid-test-data-modal/test-finalisation-invalid-test-data-modal.module';
import { TimerComponent } from './timer/timer';
import { ToolbarComponent } from './toolbar/toolbar';
import { UncoupleRecoupleComponent } from './uncouple-recouple/uncouple-recouple';

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
    ReverseDiagramPageModule,
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
