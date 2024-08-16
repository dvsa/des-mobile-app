import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import { DebriefComponentsModule } from '@pages/debrief/components/debrief-components.module';
import { DebriefAnalyticsEffects } from '@pages/debrief/debrief.analytics.effects';
import { DebriefEffects } from '@pages/debrief/debrief.effects';
import { ViewTestResultComponentsModule } from '@pages/view-test-result/components/view-test-result.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { DebriefPage } from './debrief.page';
import { DebriefPageRoutingModule } from './debrief.routing.module';

@NgModule({
  imports: [
    DebriefComponentsModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefPageRoutingModule,
    TranslateModule,
    EffectsModule.forFeature([DebriefEffects, DebriefAnalyticsEffects]),
    ViewTestResultComponentsModule,
    DirectivesModule,
  ],
  declarations: [DebriefPage],
  providers: [FaultSummaryProvider],
})
export class DebriefPageModule {}
