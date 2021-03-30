import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, withLatestFrom, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
// import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { StoreModel } from '../../../app/shared/models/store.model';

// import { SetChangeMarker } from '../change-marker/change-marker.actions';
// import { getTests } from './../tests.reducer';
// import { getCurrentTest } from './../tests.selector';

// import  * as examinerBookedActions from './examiner-booked.actions';

@Injectable()
export class ExaminerBookedEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  // @Effect()
  // setExaminerBookedEffect$ = this.actions$.pipe(
  //   ofType(examinerBookedActions.SetExaminerBooked),
  //   concatMap(action => of(action).pipe(
  //     withLatestFrom(
  //       this.store$.pipe(
  //         select(getTests),
  //         select(getCurrentTest),
  //       ),
  //     ),
  //   )),
  //   // map(([action, test]: [SetExaminerBooked, TestResultSchemasUnion]) =>
  //   map(([action, test]: [any, TestResultSchemasUnion]) =>
  //     SetChangeMarker({ payload: action.examinerBooked !== test.examinerConducted })),
  // );

}
