import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';

import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import { EcoCaptureReasonComponent } from '@pages/office/cat-adi-part2/components/eco-capture-reason/eco-capture-reason';
import { EcoRelatedFaultComponent } from '@pages/office/cat-adi-part2/components/eco-related-fault/eco-related-fault';
import { FuelEfficientDriving } from '@pages/office/cat-adi-part2/components/fuel-efficient-driving/fuel-efficient-driving';
import { ShowMeQuestionsCatADI2Component } from '@pages/office/cat-adi-part2/components/show-me-questions/show-me-questions';
import { OfficeRegistrationAndMotComponent } from '@pages/office/components/office-registration-and-mot/office-registration-and-mot.component';
import { ReasonForEnteringTeamsComponent } from '@pages/office/components/reason-for-entering-teams/reason-for-entering-teams';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { VehicleChecksOfficeCardCatADI2Component } from './components/vehicle-checks/vehicle-checks-office-card';
import { OfficeCatADIPart2PageRoutingModule } from './office.cat-adi-part2-routing.module';
import { OfficeCatADI2Page } from './office.cat-adi-part2.page';

@NgModule({
  declarations: [
    OfficeCatADI2Page,
    VehicleChecksOfficeCardCatADI2Component,
    ShowMeQuestionsCatADI2Component,
    EcoCaptureReasonComponent,
    EcoRelatedFaultComponent,
    FuelEfficientDriving,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatADIPart2PageRoutingModule,
    ComponentsModule,
    OfficeComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
    WaitingRoomToCarComponentsModule,
    DirectivesModule,
    ReasonForEnteringTeamsComponent,
    OfficeRegistrationAndMotComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
  ],
  providers: [FaultSummaryProvider],
})
export class OfficeCatADIPart2PageModule {}
