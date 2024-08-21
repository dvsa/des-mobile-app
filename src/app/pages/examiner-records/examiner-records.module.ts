import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ExaminerRecordsComponentsModule } from '@pages/examiner-records/components/examiner-records-components.module';
import { ExaminerRecordsRoutingModule } from '@pages/examiner-records/examiner-records-routing.module';
import { ExaminerRecordsAnalyticsEffects } from '@pages/examiner-records/examiner-records.analytics.effects';
import { ExaminerRecordsEffects } from '@pages/examiner-records/examiner-records.effects';
import { ExaminerRecordsPage } from './examiner-records.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgbModule,
    ReactiveFormsModule,
    ExaminerRecordsComponentsModule,
    ExaminerRecordsRoutingModule,
    EffectsModule.forFeature([ExaminerRecordsAnalyticsEffects, ExaminerRecordsEffects]),
    TranslateModule,
    ComponentsModule,
  ],
  declarations: [ExaminerRecordsPage],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ExaminerRecordsPageModule {}
