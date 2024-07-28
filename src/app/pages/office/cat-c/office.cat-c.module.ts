import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { EffectsModule } from '@ngrx/effects';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { PassFinalisationComponentsModule } from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { OfficeCatCPageRoutingModule } from './office.cat-c-routing.module';
import { OfficeCatCPage } from './office.cat-c.page';

@NgModule({
  declarations: [OfficeCatCPage],
  imports: [
    EffectsModule.forFeature([OfficeAnalyticsEffects, OfficeEffects]),
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
  providers: [FaultSummaryProvider],
})
export class OfficeCatCPageModule {}
