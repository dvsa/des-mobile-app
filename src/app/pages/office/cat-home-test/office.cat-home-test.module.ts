import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { EffectsModule } from '@ngrx/effects';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { OfficeCatBPageModule } from '@pages/office/cat-b/office.cat-b.module';
import { OfficeCatHomeTestPage } from './office.cat-home-test.page';
import { OfficeCatHomeTestPageRoutingModule } from './office.cat-home-test-routing.module';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      OfficeAnalyticsEffects,
      OfficeEffects,
    ]),
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatHomeTestPageRoutingModule,
    ComponentsModule,
    OfficeComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    OfficeCatBPageModule,
  ],
  declarations: [OfficeCatHomeTestPage],
  providers: [
    FaultSummaryProvider,
  ],
})
export class OfficeCatHomeTestPageModule {}
