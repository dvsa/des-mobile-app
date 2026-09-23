import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { EffectsModule } from '@ngrx/effects';
import { OfficeCatBPageRoutingModule } from '@pages/office/cat-b/office.cat-b-routing.module';
import { OfficeRegistrationAndMotComponent } from '@pages/office/components/office-registration-and-mot/office-registration-and-mot.component';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { ReasonForEnteringTeamsComponent } from '@pages/office/components/reason-for-entering-teams/reason-for-entering-teams';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { OfficeAnalyticsEffects } from '../office.analytics.effects';
import { OfficeEffects } from '../office.effects';
import { OfficeCatBPage } from './office.cat-b.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [OfficeCatBPage],
  imports: [
    IonicComponentsModule,
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
    ComponentsModule,
    OfficeComponentsModule,
    OfficeCatBPageRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    WaitingRoomToCarComponentsModule,
    ReasonForEnteringTeamsComponent,
    OfficeRegistrationAndMotComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
    TestFlowHeaderComponent,
  ],
  providers: [FaultSummaryProvider],
})
export class OfficeCatBPageModule {}
