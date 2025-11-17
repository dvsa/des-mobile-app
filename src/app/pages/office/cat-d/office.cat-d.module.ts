import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { EffectsModule } from '@ngrx/effects';
import { OfficeRegistrationAndMotComponent } from '@pages/office/components/office-registration-and-mot/office-registration-and-mot.component';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { ReasonForEnteringTeamsComponent } from '@pages/office/components/reason-for-entering-teams/reason-for-entering-teams';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { PassFinalisationComponentsModule } from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { OfficeCatDPageRoutingModule } from './office.cat-d-routing.module';
import { OfficeCatDPage } from './office.cat-d.page';

@NgModule({
  declarations: [OfficeCatDPage],
  imports: [
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
    ComponentsModule,
    OfficeComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    OfficeCatDPageRoutingModule,
    PassFinalisationComponentsModule,
    TestFinalisationComponentsModule,
    WaitingRoomToCarComponentsModule,
    ReasonForEnteringTeamsComponent,
    OfficeRegistrationAndMotComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
  ],
  providers: [FaultSummaryProvider],
})
export class OfficeCatDPageModule {}
