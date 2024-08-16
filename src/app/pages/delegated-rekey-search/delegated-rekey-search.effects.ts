import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { DelegatedRekeySearchProvider } from '@providers/delegated-rekey-search/delegated-rekey-search';
import { DelegatedExaminerTestSlot } from '@providers/delegated-rekey-search/mock-data/delegated-mock-data';
import { SearchProvider } from '@providers/search/search';
import { DelegatedRekeySearchErrorMessages } from './delegated-rekey-search-error-model';
import {
  DelegatedRekeySearchActions,
  SearchBookedDelegatedTest,
  SearchBookedDelegatedTestFailure,
  SearchBookedDelegatedTestSuccess,
} from './delegated-rekey-search.actions';

@Injectable()
export class DelegatedRekeySearchEffects {
  constructor(
    private actions$: Actions,
    private delegatedRekeySearchProvider: DelegatedRekeySearchProvider,
    private testSearchProvider: SearchProvider
  ) {}

  getBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchBookedDelegatedTest),
      switchMap((action) => {
        return this.testSearchProvider.getTestResult(action.appRef, undefined).pipe(
          switchMap((): Observable<DelegatedRekeySearchActions> => {
            return of(
              SearchBookedDelegatedTestFailure({
                message: DelegatedRekeySearchErrorMessages.BookingAlreadyCompleted,
              })
            );
          }),
          catchError((err: HttpErrorResponse): Observable<DelegatedRekeySearchActions> => {
            if (err.status === HttpStatusCode.BadRequest) {
              return this.delegatedRekeySearchProvider.getDelegatedExaminerBookingByAppRef(action.appRef).pipe(
                switchMap((response: any): Observable<any> => {
                  let delegatedExaminerTestSlot: DelegatedExaminerTestSlot;
                  try {
                    delegatedExaminerTestSlot = {
                      testCentre: {
                        centreId: response.testSlot.testCentre.centreId,
                        centreName: response.testSlot.testCentre.centreName,
                        costCode: response.testSlot.testCentre.costCode,
                      },
                      booking: {
                        application: {
                          applicationId: response.testSlot.booking.application.applicationId,
                          bookingSequence: response.testSlot.booking.application.bookingSequence,
                          checkDigit: response.testSlot.booking.application.checkDigit,
                          testCategory: response.testSlot.booking.application.testCategory,
                          welshTest: false,
                          extendedTest: false,
                        },
                        candidate: {
                          candidateId: response.testSlot.booking.candidate.candidateId,
                          candidateName: {
                            firstName: response.testSlot.booking.candidate.candidateName.firstName,
                            lastName: response.testSlot.booking.candidate.candidateName.lastName,
                          },
                          driverNumber: response.testSlot.booking.candidate.driverNumber,
                          dateOfBirth: response.testSlot.booking.candidate.dateOfBirth,
                          gender: response.testSlot.booking.candidate.gender,
                        },
                      },
                      slotDetail: {
                        slotId: response.testSlot.slotDetail.slotId,
                        start: response.testSlot.slotDetail.start,
                      },
                      vehicleTypeCode: response.testSlot.vehicleTypeCode,
                      examinerId: response.examinerId,
                    };
                    return of(SearchBookedDelegatedTestSuccess(delegatedExaminerTestSlot));
                  } catch (error) {
                    return of(
                      SearchBookedDelegatedTestFailure({
                        message: DelegatedRekeySearchErrorMessages.MappingToTestSlotError,
                      })
                    );
                  }
                })
              );
            }
            return of(SearchBookedDelegatedTestFailure(err));
          }),
          catchError((err) => of(SearchBookedDelegatedTestFailure(err)))
        );
      })
    )
  );
}
