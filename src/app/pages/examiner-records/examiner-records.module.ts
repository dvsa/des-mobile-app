import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EffectsModule } from '@ngrx/effects';

import { ExaminerRecordsPage } from './examiner-records.page';
import { ExaminerRecordsRoutingModule } from '@pages/examiner-records/examiner-records-routing.module';
import { ExaminerRecordsAnalyticsEffects } from '@pages/examiner-records/examiner-records.analytics.effects';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExaminerRecordsComponentsModule } from '@pages/examiner-records/components/examiner-records-components.module';
import { ExaminerRecordsEffects } from '@pages/examiner-records/examiner-records.effects';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgbModule,
    ReactiveFormsModule,
    ExaminerRecordsComponentsModule,
    ExaminerRecordsRoutingModule,
    EffectsModule.forFeature([
      ExaminerRecordsAnalyticsEffects,
      ExaminerRecordsEffects,
    ]),
    TranslateModule,
    ComponentsModule,
  ],
  declarations: [
    ExaminerRecordsPage,
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA,
  ],
})
export class ExaminerRecordsPageModule {
}
