import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import * as testsActions from '@store/tests/tests.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTestSlotId } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import * as communicationActions from './communication.actions';

@Injectable()
export class CommunicationEffects {
	constructor(
		private actions$: Actions,
		private store$: Store<StoreModel>
	) {}

	communicationSubmitInfoEffect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(communicationActions.CommunicationSubmitInfo),
			concatMap((action) =>
				of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests), select(getCurrentTestSlotId))))
			),
			switchMap(([, slotId]) => {
				return [testStatusActions.SetTestStatusStarted(slotId), testsActions.PersistTests()];
			})
		)
	);
}
