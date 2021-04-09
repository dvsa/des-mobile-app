import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';

import { testsReducer } from './tests.reducer';
import { TestSubmissionProvider } from '../../app/providers/test-submission/test-submission';
import { FaultCountProvider } from '../../app/providers/fault-count/fault-count';
import { TestsEffects } from './tests.effects';
import {
  VehicleDetailsByCategoryProvider,
} from '../../app/providers/vehicle-details-by-category/vehicle-details-by-category';
import {
  TestDataByCategoryProvider,
} from '../../app/providers/test-data-by-category/test-data-by-category';

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
