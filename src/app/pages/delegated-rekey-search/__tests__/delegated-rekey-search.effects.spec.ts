import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DelegatedRekeySearchProvider } from '@providers/delegated-rekey-search/delegated-rekey-search';
import { mockGetDelegatedBooking } from '@providers/delegated-rekey-search/mock-data/delegated-mock-data';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { UrlProviderMock } from '@providers/url/__mocks__/url.mock';
import { UrlProvider } from '@providers/url/url';
import { ReplaySubject, defer, of } from 'rxjs';
import { DelegatedRekeySearchErrorMessages } from '../delegated-rekey-search-error-model';
import * as delegatedRekeySearchActions from '../delegated-rekey-search.actions';
import { DelegatedRekeySearchEffects } from '../delegated-rekey-search.effects';
import { delegatedSearchReducer } from '../delegated-rekey-search.reducer';

function asyncError(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('DelegatedRekeySearchEffects', () => {
  let effects: DelegatedRekeySearchEffects;
  let actions$: ReplaySubject<any>;
  let delegatedRekeySearchProvider: DelegatedRekeySearchProvider;
  let searchProvider: SearchProvider;

  const getTestResultHttpErrorResponse = (status: HttpStatusCode = HttpStatusCode.BadRequest): HttpErrorResponse => {
    return new HttpErrorResponse({
      status,
      error: 'Error message',
      statusText: 'Bad request',
    });
  };

  const appRef = '123456';

  beforeEach(waitForAsync(() => {
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
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
        {
          provide: SearchProvider,
          useClass: SearchProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DelegatedRekeySearchEffects);
    delegatedRekeySearchProvider = TestBed.inject(DelegatedRekeySearchProvider);
    searchProvider = TestBed.inject(SearchProvider);
  }));

  it('should dispatch the SearchBookedTestSuccess action when searched with success', (done) => {
    spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef').and.returnValue(
      of(mockGetDelegatedBooking())
    );
    spyOn(searchProvider, 'getTestResult').and.returnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
    );
    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest('12345678910'));

    effects.getBooking$.subscribe((result) => {
      expect(result.type === delegatedRekeySearchActions.SearchBookedDelegatedTestSuccess.type).toBeTruthy();
      done();
    });
  });

  it('should dispatch the SearchBookedTestFailure action when searched with failure', (done) => {
    spyOn(searchProvider, 'getTestResult').and.returnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
    );
    spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef').and.returnValue(
      asyncError(
        new HttpErrorResponse({
          error: 'Error message',
          status: 403,
          statusText: 'Forbidden',
        })
      )
    );

    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest('12345678911'));

    effects.getBooking$.subscribe((result) => {
      expect(result.type === delegatedRekeySearchActions.SearchBookedDelegatedTestFailure.type).toBeTruthy();
      done();
    });
  });

  it('should call getDelegatedExaminerBookingByAppRef on the test search provider', (done) => {
    spyOn(searchProvider, 'getTestResult').and.returnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
    );
    spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef').and.returnValue(
      of(mockGetDelegatedBooking())
    );

    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest(appRef));

    effects.getBooking$.subscribe(() => {
      expect(delegatedRekeySearchProvider.getDelegatedExaminerBookingByAppRef).toHaveBeenCalledWith(appRef);
      done();
    });
  });

  it('should not call getBooking if getTestResult succeeds', (done) => {
    spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef').and.returnValue(
      of(mockGetDelegatedBooking())
    );

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
