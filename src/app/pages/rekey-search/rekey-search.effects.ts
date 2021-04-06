import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { RekeySearchProvider } from '../../providers/rekey-search/rekey-search';
import { CompressionProvider } from '../../providers/compression/compression';
import { SearchProvider } from '../../providers/search/search';
import {
  SearchBookedTest,
  SearchBookedTestSuccess,
  SearchBookedTestFailure, RekeySearchActions,
} from './rekey-search.actions';
import { RekeySearchErrorMessages } from './rekey-search-error-model';
import { HttpStatusCodes } from '../../shared/models/http-status-codes';

@Injectable()
export class RekeySearchEffects {

  constructor(
    private actions$: Actions,
    private testSearchProvider: SearchProvider,
    private rekeySearchProvider: RekeySearchProvider,
    private compressionProvider: CompressionProvider,
  ) {
  }

  @Effect()
  getBooking$ = this.actions$.pipe(
    ofType(SearchBookedTest),
    switchMap((action) => {
      return this.testSearchProvider.getTestResult(action.appRef, action.staffNumber)
        .pipe(
          switchMap((): Observable<RekeySearchActions> => {
            return of(SearchBookedTestFailure({
              message: RekeySearchErrorMessages.BookingAlreadyCompleted,
            }));
          }),
          catchError((err: HttpErrorResponse): Observable<RekeySearchActions> => {
            if (err.status === HttpStatusCodes.BAD_REQUEST) {
              const rekeySearchParams = {
                applicationReference: action.appRef,
                staffNumber: action.staffNumber,
              };
              return this.rekeySearchProvider.getBooking(rekeySearchParams)
                .pipe(
                  map((response) => this.compressionProvider.extractTestSlotResult(response.toString())),
                  map((testSlot: any) => SearchBookedTestSuccess(testSlot, action.staffNumber)),
                  catchError((error: any) => {
                    return of(SearchBookedTestFailure(error));
                  }),
                );
            }
            return of(SearchBookedTestFailure(err));
          }),
        );
    }),
  );

}
