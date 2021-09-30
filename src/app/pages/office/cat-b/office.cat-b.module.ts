import { NgModule } from '@angular/core';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { EffectsModule } from '@ngrx/effects';
import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { OfficeCatBPageRoutingModule } from '@pages/office/cat-b/office.cat-b-routing.module';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OfficeEffects } from '../office.effects';
import { OfficeAnalyticsEffects } from '../office.analytics.effects';
import { OfficeCatBPage } from './office.cat-b.page';

@NgModule({
  declarations: [
    OfficeCatBPage,
  ],
  imports: [
    EffectsModule.forFeature([
      OfficeAnalyticsEffects,
      OfficeEffects,
    ]),
    ComponentsModule,
    OfficeComponentsModule,
    OfficeCatBPageRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [
    FaultSummaryProvider,
  ],
})
export class OfficeCatBPageModule { }
