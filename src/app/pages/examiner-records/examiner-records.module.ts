import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';

import { ExaminerRecordsPage } from './examiner-records.page';
import { ExaminerRecordsRoutingModule } from '@pages/examiner-records/examiner-records-routing.module';
import { ExaminerRecordsAnalyticsEffects } from '@pages/examiner-records/examiner-records.analytics.effects';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExaminerRecordsComponentsModule } from '@pages/examiner-records/examiner-records-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExaminerRecordsComponentsModule,
    ExaminerRecordsRoutingModule,
    EffectsModule.forFeature([
      ExaminerRecordsAnalyticsEffects,
    ]),
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ExaminerRecordsPage,
  ],
})
export class ExaminerRecordsPageModule {
}
