import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  map, switchMap, withLatestFrom, concatMap,
} from 'rxjs/operators';

import * as dangerousFaultsActions
  from '@store/tests/test-data/common/dangerous-faults/dangerous-faults.actions';
import * as seriousFaultsActions from '@store/tests/test-data/common/serious-faults/serious-faults.actions';
import * as drivingFaultsActions from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import * as singleFaultCompetencyActions
  from '@store/tests/test-data/common/single-fault-competencies/single-fault-competencies.actions';
import * as testSummaryActions from '@store/tests/test-summary/test-summary.actions';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import * as testsActions from '@store/tests/tests.actions';
import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTestSlotId } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import * as officeActions from './office.actions';

@Injectable()
export class OfficeEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {}

  persistOfficeDataEffect$ = createEffect(() => this.actions$.pipe(
    ofType(
      dangerousFaultsActions.AddDangerousFaultComment,
      seriousFaultsActions.AddSeriousFaultComment,
      drivingFaultsActions.AddDrivingFaultComment,
      singleFaultCompetencyActions.AddSingleFaultCompetencyComment,
      testSummaryActions.DebriefWitnessed,
      testSummaryActions.DebriefUnWitnessed,
      testSummaryActions.IdentificationUsedChanged,
      testSummaryActions.IndependentDrivingTypeChanged,
      testSummaryActions.RouteNumberChanged,
      testSummaryActions.WeatherConditionsChanged,
      testSummaryActions.AdditionalInformationChanged,
      testSummaryActions.CandidateDescriptionChanged,
      testSummaryActions.D255Yes,
      testSummaryActions.D255No,
    ),
    map(() => testsActions.PersistTests()),
  ));

  completeTestEffect$ = createEffect(() => this.actions$.pipe(
    ofType(officeActions.CompleteTest),
    concatMap((action) => of(action).pipe(
      withLatestFrom(
        this.store$.pipe(
          select(getTests),
          select(getCurrentTestSlotId),
        ),
      ),
    )),
    switchMap(([, slotId]) => {
      return [
        testStatusActions.SetTestStatusCompleted(slotId),
        testsActions.PersistTests(),
      ];
    }),
  ));
}
