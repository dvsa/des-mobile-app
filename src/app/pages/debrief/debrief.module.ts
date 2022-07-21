import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { DebriefComponentsModule } from '@pages/debrief/components/debrief-components.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { DebriefEffects } from '@pages/debrief/debrief.effects';
import { DebriefAnalyticsEffects } from '@pages/debrief/debrief.analytics.effects';
import { DebriefPageRoutingModule } from './debrief.routing.module';
import { DebriefPage } from './debrief.page';
import { TestResultProvider } from '@providers/test-result/test-result';

@NgModule({
  imports: [
    DebriefComponentsModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefPageRoutingModule,
    TranslateModule,
    EffectsModule.forFeature([
      DebriefEffects,
      DebriefAnalyticsEffects,
    ]),
  ],
  declarations: [DebriefPage],
  providers: [
    FaultSummaryProvider,
    TestResultProvider,
  ],
})
export class DebriefPageModule {}
