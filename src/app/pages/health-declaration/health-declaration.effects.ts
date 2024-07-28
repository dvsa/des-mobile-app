import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, withLatestFrom } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTestSlotId } from '@store/tests/tests.selector';
import { of } from 'rxjs';
import { ContinueFromDeclaration } from './health-declaration.actions';

@Injectable()
export class HealthDeclarationEffects {
	constructor(
		private actions$: Actions,
		private store$: Store<StoreModel>
	) {}

	endHealthDeclarationEffect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ContinueFromDeclaration),
			concatMap((action) =>
				of(action).pipe(withLatestFrom(this.store$.pipe(select(getTests), select(getCurrentTestSlotId))))
			),
			concatMap(() => {
				return [testsActions.PersistTests()];
			})
		)
	);
}
