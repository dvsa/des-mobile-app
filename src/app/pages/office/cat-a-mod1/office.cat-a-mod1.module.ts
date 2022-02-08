import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { DebriefComponentsModule } from '@pages/debrief/components/debrief-components.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { CircuitComponent } from '@pages/office/cat-a-mod1/components/circuit/circuit';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { EffectsModule } from '@ngrx/effects';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
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
    EffectsModule.forFeature([
      OfficeAnalyticsEffects,
      OfficeEffects,
    ]),
  ],
  providers: [
    FaultSummaryProvider,
  ],
})
export class OfficeCatAMod1PageModule {}
