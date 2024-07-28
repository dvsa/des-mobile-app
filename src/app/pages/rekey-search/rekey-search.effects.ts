import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CompressionProvider } from '@providers/compression/compression';
import { RekeySearchProvider } from '@providers/rekey-search/rekey-search';
import { SearchProvider } from '@providers/search/search';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RekeySearchErrorMessages } from './rekey-search-error-model';
import {
	RekeySearchActions,
	SearchBookedTest,
	SearchBookedTestFailure,
	SearchBookedTestSuccess,
} from './rekey-search.actions';

@Injectable()
export class RekeySearchEffects {
	constructor(
		private actions$: Actions,
		private testSearchProvider: SearchProvider,
		private rekeySearchProvider: RekeySearchProvider,
		private compressionProvider: CompressionProvider
	) {}

	getBooking$ = createEffect(() =>
		this.actions$.pipe(
			ofType(SearchBookedTest),
			switchMap((action) => {
				return this.testSearchProvider.getTestResult(action.appRef, action.staffNumber).pipe(
					switchMap(
						(): Observable<RekeySearchActions> =>
							of(SearchBookedTestFailure({ message: RekeySearchErrorMessages.BookingAlreadyCompleted }))
					),
					catchError((err: HttpErrorResponse): Observable<RekeySearchActions> => {
						if (err.status === HttpStatusCode.BadRequest) {
							const rekeySearchParams = {
								applicationReference: action.appRef,
								staffNumber: action.staffNumber,
							};
							return this.rekeySearchProvider.getBooking(rekeySearchParams).pipe(
								map((response) => this.compressionProvider.extract<TestSlot>(response.toString())),
								map((testSlot) => SearchBookedTestSuccess(testSlot, action.staffNumber)),
								catchError((error) => of(SearchBookedTestFailure(error)))
							);
						}
						return of(SearchBookedTestFailure(err));
					})
				);
			})
		)
	);
}
