import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AssessmentReportComponent } from '@pages/office/cat-cpc/components/assessment-report/assessment-report';

import { ComponentsModule } from '@components/common/common-components.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonToolbar,
} from '@ionic/angular';
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
  imports: [
    CommonModule,
    FormsModule,
    OfficeCatCPCPageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
    ComponentsModule,
    OfficeComponentsModule,
    PassFinalisationComponentsModule,
    WaitingRoomToCarCatCPCComponentsModule,
    ReasonForEnteringTeamsComponent,
    OfficeRegistrationAndMotComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
    TestFlowHeaderComponent,
    IonCol,
    IonRow,
    IonToolbar,
    IonHeader,
    IonContent,
    IonCardHeader,
    IonCard,
    IonGrid,
    IonCardContent,
    IonFooter,
    OfficeCatCPCPage,
    AssessmentReportComponent,
    CombinationComponent,
    PassCertificateDeclarationComponent,
  ],
  providers: [FaultSummaryProvider],
})
export class OfficeCatCPCPageModule {}
