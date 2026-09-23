import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import { TranslatePipe } from '@ngx-translate/core';
import { DebriefComponentsModule } from '@pages/debrief/components/debrief-components.module';
import { DebriefAnalyticsEffects } from '@pages/debrief/debrief.analytics.effects';
import { DebriefEffects } from '@pages/debrief/debrief.effects';
import { ViewTestResultComponentsModule } from '@pages/view-test-result/components/view-test-result.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { DebriefPage } from './debrief.page';
import { DebriefPageRoutingModule } from './debrief.routing.module';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [
    IonicComponentsModule,
    DebriefComponentsModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    DebriefPageRoutingModule,
    EffectsModule.forFeature([DebriefEffects, DebriefAnalyticsEffects]),
    ViewTestResultComponentsModule,
    DirectivesModule,
    TestFlowHeaderComponent,
    TranslatePipe,
  ],
  declarations: [DebriefPage],
  providers: [FaultSummaryProvider],
})
export class DebriefPageModule {}
