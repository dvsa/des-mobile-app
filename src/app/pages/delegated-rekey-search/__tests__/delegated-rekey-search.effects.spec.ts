import { defer, of, ReplaySubject } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { DelegatedRekeySearchProvider } from '../../../providers/delegated-rekey-search/delegated-rekey-search';
import { SearchProvider } from '../../../providers/search/search';
import { HttpStatusCodes } from '../../../shared/models/http-status-codes';
import { SearchProviderMock } from '../../../providers/search/__mocks__/search.mock';
import { DelegatedRekeySearchErrorMessages } from '../delegated-rekey-search-error-model';
import { UrlProvider } from '../../../providers/url/url';
import { UrlProviderMock } from '../../../providers/url/__mocks__/url.mock';
import { AppConfigProvider } from '../../../providers/app-config/app-config';
import { AppConfigProviderMock } from '../../../providers/app-config/__mocks__/app-config.mock';
import { mockGetDelegatedBooking } from '../../../providers/delegated-rekey-search/mock-data/delegated-mock-data';
import { DelegatedRekeySearchEffects } from '../delegated-rekey-search.effects';
import { delegatedSearchReducer } from '../delegated-rekey-search.reducer';
import * as delegatedRekeySearchActions from '../delegated-rekey-search.actions';

function asyncError(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('Delegated Rekey Search Effects', () => {

  let effects: DelegatedRekeySearchEffects;
  let actions$: any;
  let delegatedRekeySearchProvider: DelegatedRekeySearchProvider;
  let searchProvider: SearchProvider;

  const getTestResultHttpErrorResponse = (status: HttpStatusCodes = 400): HttpErrorResponse => {
    return new HttpErrorResponse({
      status,
      error: 'Error message',
      statusText: 'Bad request',
    });
  };

  const appRef = '123456';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          delegatedRekeySearch: delegatedSearchReducer,
        }),
      ],
      providers: [
        DelegatedRekeySearchEffects,
        provideMockActions(() => actions$),
        Store,
        DelegatedRekeySearchProvider,
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });
  });

  beforeEach(async(() => {
    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DelegatedRekeySearchEffects);
    delegatedRekeySearchProvider = TestBed.inject(DelegatedRekeySearchProvider);
    searchProvider = TestBed.inject(SearchProvider);
  }));

  it('should dispatch the SearchBookedTestSuccess action when searched with success', (done) => {

    spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef')
      .and.returnValue(of(mockGetDelegatedBooking()));
    spyOn(searchProvider, 'getTestResult')
      .and.returnValue(asyncError(getTestResultHttpErrorResponse(HttpStatusCodes.BAD_REQUEST)));
    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest('12345678910'));

    effects.getBooking$.subscribe((result) => {
      expect(result.type === delegatedRekeySearchActions.SearchBookedDelegatedTestSuccess.type).toBeTruthy();
      done();
    });

  });

  it('should dispatch the SearchBookedTestFailure action when searched with failure', (done) => {
    spyOn(searchProvider, 'getTestResult')
      .and.returnValue(asyncError(getTestResultHttpErrorResponse(HttpStatusCodes.BAD_REQUEST)));
    spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef')
      .and.returnValue(asyncError(new HttpErrorResponse({
        error: 'Error message',
        status: 403,
        statusText: 'Forbidden',
      })));

    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest('12345678911'));

    effects.getBooking$.subscribe((result) => {
      expect(result.type === delegatedRekeySearchActions.SearchBookedDelegatedTestFailure.type).toBeTruthy();
      done();
    });

  });

  it('should call getDelegatedExaminerBookingByAppRef on the test search provider', (done) => {
    spyOn(searchProvider, 'getTestResult')
      .and.returnValue(asyncError(getTestResultHttpErrorResponse(HttpStatusCodes.BAD_REQUEST)));
    spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef')
      .and.returnValue(of(mockGetDelegatedBooking()));

    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest(appRef));

    effects.getBooking$.subscribe(() => {
      expect(delegatedRekeySearchProvider.getDelegatedExaminerBookingByAppRef).toHaveBeenCalledWith(appRef);
      done();
    });

  });

  it('should not call getBooking if getTestResult succeeds', (done) => {

    spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef')
      .and.returnValue(of(mockGetDelegatedBooking()));

    const expectedFailureAction = delegatedRekeySearchActions.SearchBookedDelegatedTestFailure({
      message: DelegatedRekeySearchErrorMessages.BookingAlreadyCompleted,
    });
    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest(appRef));

    effects.getBooking$.subscribe((result) => {
      expect(delegatedRekeySearchProvider.getDelegatedExaminerBookingByAppRef).not.toHaveBeenCalled();
      expect(result).toEqual(expectedFailureAction);
      done();
    });

  });

});
