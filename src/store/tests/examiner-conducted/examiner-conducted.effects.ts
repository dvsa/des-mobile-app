import { Injectable } from '@angular/core';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { of } from 'rxjs';
import { concatMap, map, withLatestFrom } from 'rxjs/operators';
import { SetChangeMarker } from '../change-marker/change-marker.actions';
import { getTests } from '../tests.reducer';
import { getCurrentTest } from '../tests.selector';
import { SetExaminerConducted } from './examiner-conducted.actions';

@Injectable()
export class ExaminerConductedEffects {
	constructor(
		private actions$: Actions,
		private store$: Store<StoreModel>
	) {}

	setExaminerConductedEffect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(SetExaminerConducted),
			concatMap((action) =>
				of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests), select(getCurrentTest))))
			),
			map(([action, test]: [ReturnType<typeof SetExaminerConducted>, TestResultSchemasUnion]) =>
				SetChangeMarker(action.examinerConducted !== test.examinerBooked)
			)
		)
	);
}
