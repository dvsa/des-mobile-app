import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExaminerRecordsComponentsModule } from '@pages/examiner-records/components/examiner-records-components.module';
import { ExaminerRecordsLabelTextComponentModule } from '@pages/examiner-records/components/examiner-records-label-text/examiner-records-label-text.module';
import { ExaminerRecordsRoutingModule } from '@pages/examiner-records/examiner-records-routing.module';
import { ExaminerRecordsAnalyticsEffects } from '@pages/examiner-records/examiner-records.analytics.effects';
import { ExaminerRecordsEffects } from '@pages/examiner-records/examiner-records.effects';
import { ExaminerRecordsPage } from './examiner-records.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [
    IonicComponentsModule,
    CommonModule,
    FormsModule,

    NgbModule,
    ReactiveFormsModule,
    ExaminerRecordsComponentsModule,
    ExaminerRecordsRoutingModule,
    EffectsModule.forFeature([ExaminerRecordsAnalyticsEffects, ExaminerRecordsEffects]),
    ComponentsModule,
    ExaminerRecordsLabelTextComponentModule,
  ],
  declarations: [ExaminerRecordsPage],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ExaminerRecordsPageModule {}
