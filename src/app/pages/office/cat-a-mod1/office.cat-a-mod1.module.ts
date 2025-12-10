import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { EffectsModule } from '@ngrx/effects';
import { DebriefComponentsModule } from '@pages/debrief/components/debrief-components.module';
import { CircuitComponent } from '@pages/office/cat-a-mod1/components/circuit/circuit';
import { OfficeRegistrationAndMotComponent } from '@pages/office/components/office-registration-and-mot/office-registration-and-mot.component';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { ReasonForEnteringTeamsComponent } from '@pages/office/components/reason-for-entering-teams/reason-for-entering-teams';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { PipesModule } from '@shared/pipes/pipes.module';
import { OfficeCatAMod1PageRoutingModule } from './office.cat-a-mod1-routing.module';
import { OfficeCatAMod1Page } from './office.cat-a-mod1.page';

@NgModule({
  declarations: [OfficeCatAMod1Page, CircuitComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatAMod1PageRoutingModule,
    ComponentsModule,
    OfficeComponentsModule,
    ReactiveFormsModule,
    DebriefComponentsModule,
    PipesModule,
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
    WaitingRoomToCarComponentsModule,
    ReasonForEnteringTeamsComponent,
    OfficeRegistrationAndMotComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
    TestFlowHeaderComponent,
  ],
  providers: [FaultSummaryProvider],
})
export class OfficeCatAMod1PageModule {}
