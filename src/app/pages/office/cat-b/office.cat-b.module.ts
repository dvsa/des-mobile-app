import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { IonicModule } from '@ionic/angular';
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

@NgModule({
  declarations: [OfficeCatBPage],
  imports: [
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
    ComponentsModule,
    OfficeComponentsModule,
    OfficeCatBPageRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    WaitingRoomToCarComponentsModule,
    ReasonForEnteringTeamsComponent,
    OfficeRegistrationAndMotComponent,
    PracticeModeBanner,
    PracticeModeExitButton,
  ],
  providers: [FaultSummaryProvider],
})
export class OfficeCatBPageModule {}
