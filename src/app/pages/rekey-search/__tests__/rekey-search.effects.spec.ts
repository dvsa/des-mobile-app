import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { ReplaySubject, defer, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TestSlot } from '@dvsa/mes-journal-schema';
import { CompressionProviderMock } from '@providers/compression/__mocks__/compression.mock';
import { CompressionProvider } from '@providers/compression/compression';
import { RekeySearchProviderMock } from '@providers/rekey-search/__mocks__/rekey-search.mock';
import { RekeySearchProvider } from '@providers/rekey-search/rekey-search';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { DateTime } from '@shared/helpers/date-time';
import { RekeySearchErrorMessages } from '../rekey-search-error-model';
import * as rekeySearchActions from '../rekey-search.actions';
import { RekeySearchEffects } from '../rekey-search.effects';
import { rekeySearchReducer } from '../rekey-search.reducer';

function asyncError(errorObject: Error) {
  return defer(() => Promise.reject(errorObject));
}

describe('RekeySearchEffects', () => {
  let effects: RekeySearchEffects;
  let actions$: ReplaySubject<Action>;
  let rekeySearchProvider: RekeySearchProvider;
  let compressionProvider: CompressionProvider;
  let testSearchProvider: SearchProvider;

  const appRef = '123456';
  const staffNumber = '654321';

  const getTestResultHttpErrorResponse = (status: HttpStatusCode = HttpStatusCode.BadRequest): HttpErrorResponse => {
    return new HttpErrorResponse({
      status,
      error: 'Error message',
      statusText: 'Bad request',
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          rekeySearch: rekeySearchReducer,
        }),
      ],
      providers: [
        RekeySearchEffects,
        provideMockActions(() => actions$),
        {
          provide: RekeySearchProvider,
          useClass: RekeySearchProviderMock,
        },
        {
          provide: SearchProvider,
          useClass: SearchProviderMock,
        },
        {
          provide: CompressionProvider,
          useClass: CompressionProviderMock,
        },
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(RekeySearchEffects);
    testSearchProvider = TestBed.inject(SearchProvider);
    rekeySearchProvider = TestBed.inject(RekeySearchProvider);
    compressionProvider = TestBed.inject(CompressionProvider);
  });

  describe('testIsLessThanHalfAnHourLate', () => {
    it('should return false if slotDetail.start is not defined', () => {
      const bookedTestsSlot = { slotDetail: {} } as TestSlot;
      expect(effects.testIsLessThanHalfAnHourLate(bookedTestsSlot)).toBe(false);
    });

    it('should return true if the test is less than 30 minutes old', () => {
      const startTime = new DateTime().subtract(20, 'minutes').toString();
      const bookedTestsSlot = { slotDetail: { start: startTime } } as TestSlot;
      expect(effects.testIsLessThanHalfAnHourLate(bookedTestsSlot)).toBe(true);
    });

    it('should return false if the test is more than 30 minutes old', () => {
      const startTime = new DateTime().subtract(40, 'minutes').toString();
      const bookedTestsSlot = { slotDetail: { start: startTime } } as TestSlot;
      expect(effects.testIsLessThanHalfAnHourLate(bookedTestsSlot)).toBe(false);
    });

    it('should return false if the test is exactly 30 minutes old', () => {
      const startTime = new DateTime().subtract(30, 'minutes').toString();
      const bookedTestsSlot = { slotDetail: { start: startTime } } as TestSlot;
      expect(effects.testIsLessThanHalfAnHourLate(bookedTestsSlot)).toBe(false);
    });
  });

  it('should dispatch the SearchBookedTestSuccess action when searched with success', async () => {
    vi.spyOn(testSearchProvider, 'getTestResult').mockReturnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
    );
    vi.spyOn(rekeySearchProvider, 'getBooking');
    vi.spyOn(compressionProvider, 'extract');
    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));
    const result = await firstValueFrom(effects.getBooking$);
    expect(compressionProvider.extract<TestSlot>).toHaveBeenCalled();
    expect(result.type === rekeySearchActions.SearchBookedTestSuccess.type).toBeTruthy();
  });

  it('should dispatch the SearchBookedTestFailure action when searched with failure', async () => {
    vi.spyOn(testSearchProvider, 'getTestResult').mockReturnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
    );
    vi.spyOn(rekeySearchProvider, 'getBooking').mockReturnValue(
      asyncError(
        new HttpErrorResponse({
          error: 'Error message',
          status: 403,
          statusText: 'Forbidden',
        })
      )
    );
    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));
    const result = await firstValueFrom(effects.getBooking$);
    expect(result.type === rekeySearchActions.SearchBookedTestFailure.type).toBeTruthy();
  });

  it('should call getTestResult on the test search provider', async () => {
    await new Promise<void>((done, reject) => {
      vi.spyOn(testSearchProvider, 'getTestResult');

      actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));

      effects.getBooking$.subscribe(() => {
        try {
          expect(testSearchProvider.getTestResult).toHaveBeenCalledWith(appRef, staffNumber);
          done();
        } catch (error) {
          reject(error);
        }
      }, reject);
    });
  });

  it('should not call getBooking if getTestResult succeeds', async () => {
    vi.spyOn(rekeySearchProvider, 'getBooking');
    const expectedFailureAction = rekeySearchActions.SearchBookedTestFailure({
      message: RekeySearchErrorMessages.BookingAlreadyCompleted,
    });
    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));
    const result = await firstValueFrom(effects.getBooking$);
    expect(rekeySearchProvider.getBooking).not.toHaveBeenCalled();
    expect(result).toEqual(expectedFailureAction);
  });

  it('should call getBooking if getTestResult fails with a 400 status code', async () => {
    vi.spyOn(testSearchProvider, 'getTestResult').mockReturnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.BadRequest))
    );
    vi.spyOn(rekeySearchProvider, 'getBooking');
    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));
    const result = await firstValueFrom(effects.getBooking$);
    expect(rekeySearchProvider.getBooking).toHaveBeenCalledWith({
      staffNumber,
      applicationReference: appRef,
    });
    expect(result.type === rekeySearchActions.SearchBookedTestSuccess.type).toBeTruthy();
  });

  it('should dispatch a SearchBookedTestFailure action if getTestResult fails with a 500 status code', async () => {
    vi.spyOn(testSearchProvider, 'getTestResult').mockReturnValue(
      asyncError(getTestResultHttpErrorResponse(HttpStatusCode.InternalServerError))
    );
    vi.spyOn(rekeySearchProvider, 'getBooking');
    actions$.next(rekeySearchActions.SearchBookedTest(appRef, staffNumber));
    const result = await firstValueFrom(effects.getBooking$);
    expect(rekeySearchProvider.getBooking).not.toHaveBeenCalled();
    expect(result.type === rekeySearchActions.SearchBookedTestFailure.type).toBeTruthy();
  });
});
