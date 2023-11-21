import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';

import { ExaminerStatsPage } from './examiner-stats.page';
import { ExaminerStatsRoutingModule } from '@pages/examiner-stats/examiner-stats-routing.module';
import { ExaminerStatsAnalyticsEffects } from '@pages/examiner-stats/examiner-stats.analytics.effects';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExaminerStatsComponentsModule } from '@pages/examiner-stats/examiner-stats-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExaminerStatsComponentsModule,
    ExaminerStatsRoutingModule,
    EffectsModule.forFeature([
      ExaminerStatsAnalyticsEffects,
    ]),
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ExaminerStatsPage,
  ],
})
export class ExaminerStatsPageModule {
}
