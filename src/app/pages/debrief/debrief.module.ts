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
import { ViewTestResultComponentsModule } from '@pages/view-test-result/components/view-test-result.components.module';
import { DebriefPageRoutingModule } from './debrief.routing.module';
import { DebriefPage } from './debrief.page';

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
    ViewTestResultComponentsModule,
  ],
  declarations: [DebriefPage],
  providers: [
    FaultSummaryProvider,
  ],
})
export class DebriefPageModule {}
