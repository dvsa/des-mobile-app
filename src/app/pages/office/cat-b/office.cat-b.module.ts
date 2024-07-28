import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, NavParams } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { OfficeCatBPageRoutingModule } from '@pages/office/cat-b/office.cat-b-routing.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
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
  ],
  providers: [FaultSummaryProvider, NavParams],
})
export class OfficeCatBPageModule {}
