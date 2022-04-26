import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import {
  PassFinalisationComponentsModule,
} from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { OfficeCatCPage } from './office.cat-c.page';
import { OfficeCatCPageRoutingModule } from './office.cat-c-routing.module';

@NgModule({
  declarations: [OfficeCatCPage],
  imports: [
    EffectsModule.forFeature([
      OfficeAnalyticsEffects,
      OfficeEffects,
    ]),
    ComponentsModule,
    OfficeComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    OfficeCatCPageRoutingModule,
    PassFinalisationComponentsModule,
    TestFinalisationComponentsModule,
    WaitingRoomToCarComponentsModule,
  ],
  providers: [
    FaultSummaryProvider,
  ],
})
export class OfficeCatCPageModule {}
