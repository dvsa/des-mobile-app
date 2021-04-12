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

@NgModule({
  imports: [
    StoreModule.forFeature('tests', testsReducer),
    EffectsModule.forFeature([
      TestsEffects,
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
