import { HttpErrorResponse, HttpStatusCode, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DelegatedRekeySearchProvider } from '@providers/delegated-rekey-search/delegated-rekey-search';
import { mockGetDelegatedBooking } from '@providers/delegated-rekey-search/mock-data/delegated-mock-data';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { UrlProviderMock } from '@providers/url/__mocks__/url.mock';
import { UrlProvider } from '@providers/url/url';
import { ReplaySubject, defer, firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DelegatedRekeySearchErrorMessages } from '../delegated-rekey-search-error-model';
import * as delegatedRekeySearchActions from '../delegated-rekey-search.actions';
import { DelegatedRekeySearchEffects } from '../delegated-rekey-search.effects';
import { delegatedSearchReducer } from '../delegated-rekey-search.reducer';

function asyncError(errorObject: {
  status: number;
  error: string;
}) {
  return defer(() => Promise.reject(errorObject));
}

describe('DelegatedRekeySearchEffects', () => {
  let effects: DelegatedRekeySearchEffects;
  let actions$: ReplaySubject<Action>;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(DelegatedRekeySearchEffects);
    delegatedRekeySearchProvider = TestBed.inject(DelegatedRekeySearchProvider);
    searchProvider = TestBed.inject(SearchProvider);
  });

  it('should dispatch the SearchBookedTestSuccess action when searched with success', async () => {
    vi.spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef').mockReturnValue(
      of(mockGetDelegatedBooking())
    );
    vi.spyOn(searchProvider, 'getTestResult').mockReturnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
    );
    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest('12345678910'));
    const result = await firstValueFrom(effects.getBooking$);
    expect(result.type === delegatedRekeySearchActions.SearchBookedDelegatedTestSuccess.type).toBeTruthy();
  });

  it('should dispatch the SearchBookedTestFailure action when searched with failure', async () => {
    vi.spyOn(searchProvider, 'getTestResult').mockReturnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
    );
    vi.spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef').mockReturnValue(
      asyncError(
        new HttpErrorResponse({
          error: 'Error message',
          status: 403,
          statusText: 'Forbidden',
        })
      )
    );
    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest('12345678911'));
    const result = await firstValueFrom(effects.getBooking$);
    expect(result.type === delegatedRekeySearchActions.SearchBookedDelegatedTestFailure.type).toBeTruthy();
  });

  it('should call getDelegatedExaminerBookingByAppRef on the test search provider', async () => {
    await new Promise<void>((done, reject) => {
      vi.spyOn(searchProvider, 'getTestResult').mockReturnValue(
        asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
      );
      vi.spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef').mockReturnValue(
        of(mockGetDelegatedBooking())
      );

      actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest(appRef));

      effects.getBooking$.subscribe(() => {
        try {
          expect(delegatedRekeySearchProvider.getDelegatedExaminerBookingByAppRef).toHaveBeenCalledWith(appRef);
          done();
        } catch (error) {
          reject(error);
        }
      }, reject);
    });
  });

  it('should not call getBooking if getTestResult succeeds', async () => {
    vi.spyOn(delegatedRekeySearchProvider, 'getDelegatedExaminerBookingByAppRef').mockReturnValue(
      of(mockGetDelegatedBooking())
    );
    const expectedFailureAction = delegatedRekeySearchActions.SearchBookedDelegatedTestFailure({
      message: DelegatedRekeySearchErrorMessages.BookingAlreadyCompleted,
    });
    actions$.next(delegatedRekeySearchActions.SearchBookedDelegatedTest(appRef));
    const result = await firstValueFrom(effects.getBooking$);
    expect(delegatedRekeySearchProvider.getDelegatedExaminerBookingByAppRef).not.toHaveBeenCalled();
    expect(result).toEqual(expectedFailureAction);
  });
});
