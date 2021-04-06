import { async, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { StoreModule, Store } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
import { ReplaySubject, defer } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

import { rekeySearchReducer } from '../rekey-search.reducer';
import { RekeySearchProvider } from '../../../providers/rekey-search/rekey-search';
import { RekeySearchProviderMock } from '../../../providers/rekey-search/__mocks__/rekey-search.mock';
import * as rekeySearchActions from '../rekey-search.actions';
import { CompressionProvider } from '../../../providers/compression/compression';
import { CompressionProviderMock } from '../../../providers/compression/__mocks__/compression.mock';
import { SearchProvider } from '../../../providers/search/search';
import { SearchProviderMock } from '../../../providers/search/__mocks__/search.mock';
import { RekeySearchErrorMessages } from '../rekey-search-error-model';
import { HttpStatusCodes } from '../../../shared/models/http-status-codes';
import { RekeySearchEffects } from '../rekey-search.effects';

describe('Rekey Search Effects', () => {

  let effects: RekeySearchEffects;
  let actions$: any;
  let rekeySearchProvider: RekeySearchProvider;
  let compressionProvider: CompressionProvider;
  let testSearchProvider: SearchProvider;

  const appRef = '123456';
  const staffNumber = '654321';

  const getTestResultHttpErrorResponse = (status: HttpStatusCodes = 400): HttpErrorResponse => {
    return new HttpErrorResponse({
      status,
      error: 'Error message',
      statusText: 'Bad request',
    });
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          rekeySearch: rekeySearchReducer,
        }),
      ],
      providers: [
        RekeySearchEffects,
        provideMockActions(() => actions$),
        { provide: RekeySearchProvider, useClass: RekeySearchProviderMock },
        { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: CompressionProvider, useClass: CompressionProviderMock },
        Store,
      ],
    });
  });

  beforeEach(async(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(RekeySearchEffects);
    testSearchProvider = TestBed.inject(SearchProvider);
    rekeySearchProvider = TestBed.inject(RekeySearchProvider);
    compressionProvider = TestBed.inject(CompressionProvider);
  }));

  it('should dispatch the SearchBookedTestSuccess action when searched with success', (done) => {

    spyOn(testSearchProvider, 'getTestResult')
      .and.returnValue(asyncError(getTestResultHttpErrorResponse(HttpStatusCodes.BAD_REQUEST)));
    spyOn(rekeySearchProvider, 'getBooking').and.callThrough();
    spyOn(compressionProvider, 'extractTestSlotResult');

    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));

    effects.getBooking$.subscribe((result) => {
      expect(compressionProvider.extractTestSlotResult).toHaveBeenCalled();
      expect(result.type === rekeySearchActions.SearchBookedTestSuccess.type).toBeTruthy();
      done();
    });

  });

  it('should dispatch the SearchBookedTestFailure action when searched with failure', (done) => {

    spyOn(testSearchProvider, 'getTestResult')
      .and.returnValue(asyncError(getTestResultHttpErrorResponse(HttpStatusCodes.BAD_REQUEST)));
    spyOn(rekeySearchProvider, 'getBooking').and.returnValue(asyncError(new HttpErrorResponse({
      error: 'Error message',
      status: 403,
      statusText: 'Forbidden',
    })));

    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));

    effects.getBooking$.subscribe((result) => {
      expect(result.type === rekeySearchActions.SearchBookedTestFailure.type).toBeTruthy();
      done();
    });

  });

  it('should call getTestResult on the test search provider', (done) => {

    spyOn(testSearchProvider, 'getTestResult').and.callThrough();

    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));

    effects.getBooking$.subscribe((result) => {
      expect(testSearchProvider.getTestResult).toHaveBeenCalledWith(appRef, staffNumber);
      done();
    });

  });

  it('should not call getBooking if getTestResult succeeds', (done) => {

    spyOn(rekeySearchProvider, 'getBooking').and.callThrough();

    const expectedFailureAction = rekeySearchActions.SearchBookedTestFailure({
      message: RekeySearchErrorMessages.BookingAlreadyCompleted,
    });

    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));

    effects.getBooking$.subscribe((result) => {
      expect(rekeySearchProvider.getBooking).not.toHaveBeenCalled();
      expect(result).toEqual(expectedFailureAction);
      done();
    });

  });

  it('should call getBooking if getTestResult fails with a 400 status code', (done) => {

    spyOn(testSearchProvider, 'getTestResult')
      .and.returnValue(asyncError(getTestResultHttpErrorResponse(HttpStatusCodes.BAD_REQUEST)));
    spyOn(rekeySearchProvider, 'getBooking').and.callThrough();

    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));

    effects.getBooking$.subscribe((result) => {
      expect(rekeySearchProvider.getBooking).toHaveBeenCalledWith({
        staffNumber,
        applicationReference: appRef,
      });
      expect(result.type === rekeySearchActions.SearchBookedTestSuccess.type).toBeTruthy();
      done();
    });

  });

  it('should dispatch a SearchBookedTestFailure action if getTestResult fails with a 500 status code', (done) => {

    spyOn(testSearchProvider, 'getTestResult')
      .and.returnValue(asyncError(getTestResultHttpErrorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR)));
    spyOn(rekeySearchProvider, 'getBooking').and.callThrough();

    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));

    effects.getBooking$.subscribe((result) => {
      expect(rekeySearchProvider.getBooking).not.toHaveBeenCalled();
      expect(result.type === rekeySearchActions.SearchBookedTestFailure.type).toBeTruthy();
      done();
    });

  });

});

function asyncError(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}
