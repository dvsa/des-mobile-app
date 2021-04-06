import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';

import { testsReducer } from './tests.reducer';
import { TestSubmissionProvider } from '../../app/providers/test-submission/test-submission';
import { FaultCountProvider } from '../../app/providers/fault-count/fault-count';
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
    // TestDataByCategoryProvider,
    // ManoeuvresByCategoryProvider,
    // VehicleDetailsByCategoryProvider,
  ],
})
export class TestsModule {}
