import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ExaminerRecordsEffects } from './examiner-records.effects';
import * as examinerRecordsReducer from './examiner-records.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      examinerRecordsReducer.examinerRecordsFeatureKey,
      examinerRecordsReducer.examinerRecordsReducer
    ),
    EffectsModule.forFeature([ExaminerRecordsEffects]),
  ],
})
export class ExaminerRecordsStoreModule {}
