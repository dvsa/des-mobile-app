import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { ManoeuvresByCategoryProvider } from '@providers/manoeuvres-by-category/manoeuvres-by-category';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { TestSubmissionProvider } from '@providers/test-submission/test-submission';
import { VehicleDetailsByCategoryProvider } from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { ExaminerBookedEffects } from '@store/tests/examiner-booked/examiner-booked.effects';
import { ExaminerConductedEffects } from '@store/tests/examiner-conducted/examiner-conducted.effects';
import { TestDataEffects } from '@store/tests/test-data/test-data.effects';
import { TestStatusAnalyticsEffects } from '@store/tests/test-status/test-status.analytics.effects';
import { TestsAnalyticsEffects } from '@store/tests/tests.analytics.effects';
import { TestsEffects } from './tests.effects';
import { testsReducer } from './tests.reducer';

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
		NavigationStateProvider,
		TestDataByCategoryProvider,
		ManoeuvresByCategoryProvider,
		VehicleDetailsByCategoryProvider,
	],
})
export class TestsModule {}
