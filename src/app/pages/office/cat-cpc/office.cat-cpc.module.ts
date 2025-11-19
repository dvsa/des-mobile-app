import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentReportComponent } from '@pages/office/cat-cpc/components/assessment-report/assessment-report';
import { PipesModule } from '@shared/pipes/pipes.module';

import { ComponentsModule } from '@components/common/common-components.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import { OfficeRegistrationAndMotComponent } from '@pages/office/components/office-registration-and-mot/office-registration-and-mot.component';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { ReasonForEnteringTeamsComponent } from '@pages/office/components/reason-for-entering-teams/reason-for-entering-teams';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { PassFinalisationComponentsModule } from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { WaitingRoomToCarCatCPCComponentsModule } from '@pages/waiting-room-to-car/cat-cpc/components/waiting-room-to-car.cat-cpc.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { CombinationComponent } from './components/combination/combination';
import { PassCertificateDeclarationComponent } from './components/pass-certificate-declaration/pass-certificate-declaration';
import { OfficeCatCPCPageRoutingModule } from './office.cat-cpc-routing.module';
import { OfficeCatCPCPage } from './office.cat-cpc.page';

@NgModule({
  declarations: [
    OfficeCatCPCPage,
    AssessmentReportComponent,
    CombinationComponent,
    PassCertificateDeclarationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    OfficeCatCPCPageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
    ComponentsModule,
    OfficeComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    WaitingRoomToCarCatCPCComponentsModule,
    DirectivesModule,
    ReasonForEnteringTeamsComponent,
    OfficeRegistrationAndMotComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
  ],
  providers: [FaultSummaryProvider],
})
export class OfficeCatCPCPageModule {}
