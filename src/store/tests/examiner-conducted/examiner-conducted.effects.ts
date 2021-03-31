import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, withLatestFrom, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { StoreModel } from '../../../app/shared/models/store.model';

// import { getTests } from './../tests.reducer';
// import { getCurrentTest } from './../tests.selector';
// import { SetChangeMarker } from '../change-marker/change-marker.actions';
// import { SetExaminerConducted, SET_EXAMINER_CONDUCTED } from './examiner-conducted.actions';

@Injectable()
export class ExaminerConductedEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<StoreModel>,
  ) {
  }

  // @Effect()
  // setExaminerConductedEffect$ = this.actions$.pipe(
  //   ofType(SET_EXAMINER_CONDUCTED),
  //   concatMap(action => of(action).pipe(
  //     withLatestFrom(
  //       this.store$.pipe(
  //         select(getTests),
  //         select(getCurrentTest),
  //       ),
  //     ),
  //   )),
  //   map(([action, test]: [SetExaminerConducted, TestResultSchemasUnion]) =>
  //     new SetChangeMarker(action.examinerConducted !== test.examinerBooked)),
  // );

  // setExaminerConductedEffect$ = createEffect(() => this.actions$.pipe(
  //   ofType(SetExaminerConducted),
  //   concatMap(action => of(action).pipe(
  //     withLatestFrom(
  //       this.store$.pipe(
  //         select(getTests),
  //         select(getCurrentTest),
  //       ),
  //     ),
  //     map(([action, test]: [SetExaminerConducted, TestResultSchemasUnion]) =>
  //       // SetChangeMarker(action.examinerConducted !== test.examinerBooked))
  //   )),
  // ));

}
