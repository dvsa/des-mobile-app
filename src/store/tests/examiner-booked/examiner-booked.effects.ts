import { Injectable } from '@angular/core';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, map, withLatestFrom } from 'rxjs/operators';

import { StoreModel } from '@shared/models/store.model';
import { SetChangeMarker } from '../change-marker/change-marker.actions';
import { getTests } from '../tests.reducer';
import { getCurrentTest } from '../tests.selector';
import { SetExaminerBooked } from './examiner-booked.actions';

@Injectable()
export class ExaminerBookedEffects {
	constructor(
		private actions$: Actions,
		private store$: Store<StoreModel>
	) {}

	setExaminerBookedEffect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(SetExaminerBooked),
			concatMap((action) =>
				of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests), select(getCurrentTest))))
			),
			map(([action, test]: [ReturnType<typeof SetExaminerBooked>, TestResultSchemasUnion]) =>
				SetChangeMarker(action.examinerBooked !== test.examinerConducted)
			)
		)
	);
}
