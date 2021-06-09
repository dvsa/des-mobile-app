import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';

import { TestSubmissionProvider } from '@providers/test-submission/test-submission';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import {
  VehicleDetailsByCategoryProvider,
} from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import {
  TestDataByCategoryProvider,
} from '@providers/test-data-by-category/test-data-by-category';
import { testsReducer } from './tests.reducer';
import { TestsEffects } from './tests.effects';
import { TestDataEffects } from '@store/tests/test-data/test-data.effects';
import { TestsAnalyticsEffects } from '@store/tests/tests.analytics.effects';
import { ExaminerBookedEffects } from '@store/tests/examiner-booked/examiner-booked.effects';
import { ExaminerConductedEffects } from '@store/tests/examiner-conducted/examiner-conducted.effects';
import { TestStatusAnalyticsEffects } from '@store/tests/test-status/test-status.analytics.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('tests', testsReducer),
    EffectsModule.forFeature([
      TestsEffects,
      TestsAnalyticsEffects,
      TestDataEffects,
      ExaminerBookedEffects,
      ExaminerConductedEffects,
      TestStatusAnalyticsEffects,
    ]),
    RouterModule,
  ],
  providers: [
    TestSubmissionProvider,
    FaultCountProvider,
    // NavigationProvider,
    // NavigationStateProvider,
    TestDataByCategoryProvider,
    // ManoeuvresByCategoryProvider @TODO: Not needed in ADI2, so bring over when required;
    VehicleDetailsByCategoryProvider,
  ],
})
export class TestsModule {}
