import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';

import { EffectsModule } from '@ngrx/effects';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import {
  ShowMeQuestionsCatADI2Component,
} from '@pages/office/cat-adi-part2/components/show-me-questions/show-me-questions';
import { OfficeCatADI2Page } from './office.cat-adi-part2.page';
import { OfficeCatADIPart2PageRoutingModule } from './office.cat-adi-part2-routing.module';
import { VehicleChecksOfficeCardCatADI2Component } from './components/vehicle-checks/vehicle-checks-office-card';

@NgModule({
  declarations: [
    OfficeCatADI2Page,
    VehicleChecksOfficeCardCatADI2Component,
    ShowMeQuestionsCatADI2Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatADIPart2PageRoutingModule,
    ComponentsModule,
    OfficeComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([
      OfficeAnalyticsEffects,
      OfficeEffects,
    ]),
  ],
  providers: [
    FaultSummaryProvider,
  ],
})
export class OfficeCatADIPart2PageModule {}
