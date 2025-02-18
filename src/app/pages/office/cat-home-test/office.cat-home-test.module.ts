import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { ReasonForEnteringTeamsComponent } from '@pages/office/components/reason-for-entering-teams/reason-for-entering-teams';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { OfficeCatHomeTestPageRoutingModule } from './office.cat-home-test-routing.module';
import { OfficeCatHomeTestPage } from './office.cat-home-test.page';

@NgModule({
  imports: [
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatHomeTestPageRoutingModule,
    ComponentsModule,
    OfficeComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    ReasonForEnteringTeamsComponent,
  ],
  declarations: [OfficeCatHomeTestPage],
  providers: [FaultSummaryProvider],
})
export class OfficeCatHomeTestPageModule {}
