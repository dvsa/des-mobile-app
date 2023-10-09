import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';

import { ExaminerStatsPage } from './examiner-stats.page';
import { ExaminerStatsRoutingModule } from '@pages/examiner-stats/examiner-stats-routing.module';
import { ExaminerStatsAnalyticsEffects } from '@pages/examiner-stats/examiner-stats.analytics.effects';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExaminerStatsRoutingModule,
    EffectsModule.forFeature([
      ExaminerStatsAnalyticsEffects,
    ]),
    TranslateModule,
    ComponentsModule,
  ],
  declarations: [ExaminerStatsPage],
})
export class ExaminerStatsPageModule {}