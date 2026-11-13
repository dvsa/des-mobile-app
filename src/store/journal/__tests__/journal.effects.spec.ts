import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ReplaySubject, firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { JournalRefreshModes } from '@providers/analytics/analytics.model';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfig } from '@providers/app-config/app-config.model';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import journalSlotsDataMock from '@providers/journal/__mocks__/journal-slots-data.mock';
import { JournalProviderMock } from '@providers/journal/__mocks__/journal.mock';
import { JournalProvider } from '@providers/journal/journal';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { NetworkConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime, Duration } from '@shared/helpers/date-time';

import { HttpResponse } from '@angular/common/http';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { JournalData, TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { provideMockStore } from '@ngrx/store/testing';
import { CompletedTestPersistenceProviderMock } from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { CompressionProvider } from '@providers/compression/compression';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { LoadRemoteTests } from '@store/tests/tests.actions';
import { TestResultsRehydrated } from '@store/tests/tests.model';
import { TestResultRehydration, getTests } from '@store/tests/tests.reducer';
import { unitTestErrorCause } from '../../../test-setup.vitest';
import * as journalActions from '../journal.actions';
import { JournalRehydrationNull, JournalRehydrationSuccess } from '../journal.actions';
import { JournalEffects, JournalRehydrationPage, JournalRehydrationType } from '../journal.effects';
import { JournalModel } from '../journal.model';
import { getJournalState, journalReducer } from '../journal.reducer';

describe('JournalEffects', () => {
  let effects: JournalEffects;
  let actions$: ReplaySubject<any>;
  let journalProvider: JournalProvider;
  let slotProvider: SlotProvider;
  let store$: Store<JournalModel>;
  let networkStateProvider: NetworkStateProvider;
  let searchProvider: SearchProvider;
  let compressionProvider: CompressionProvider;
  let appConfigProvider: AppConfigProvider;

  const initialState = {
    tests: {
      currentTest: { slotId: '1' },
      startedTests: {},
      testStatus: { 1: TestStatus.Started },
    },
    journal: {
      slots: {
        '2023-01-01': [
          {
            slotData: {
              slotDetail: { slotId: '1' },
              booking: {
                application: {
                  applicationId: 1,
                  bookingSequence: 2,
                  checkDigit: 3,
                },
              },
            },
          },
        ],
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          journal: journalReducer,
          appInfo: () => ({
            versionNumber: '5',
          }),
        }),
      ],
      providers: [
        JournalEffects,
        provideMockActions(() => actions$),
        { provide: JournalProvider, useClass: JournalProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
        { provide: CompletedTestPersistenceProvider, useClass: CompletedTestPersistenceProviderMock },
        { provide: CompressionProvider, useClass: CompressionProvider },
        Store,
        SlotProvider,
        provideMockStore({ initialState }),
      ],
    });

    // ARRANGE
    actions$ = new ReplaySubject(1);
    journalProvider = TestBed.inject(JournalProvider);
    (journalProvider as any).resetErrors();
    effects = TestBed.inject(JournalEffects);
    slotProvider = TestBed.inject(SlotProvider);
    store$ = TestBed.inject(Store);
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    appConfigProvider = TestBed.inject(AppConfigProvider);
    searchProvider = TestBed.inject(SearchProvider);
    compressionProvider = TestBed.inject(CompressionProvider);
  });

  it('should dispatch the success action when the journal loads successfully', async () => {
    vi.spyOn(journalProvider, 'getJournal');
    vi.spyOn(journalProvider, 'saveJournalForOffline');
    vi.spyOn(slotProvider, 'detectSlotChanges');
    vi.spyOn(slotProvider, 'extendWithEmptyDays');
    vi.spyOn(slotProvider, 'getRelevantSlots');
    vi.spyOn(compressionProvider, 'extract');
    vi.spyOn(compressionProvider, 'compress');
    actions$.next(journalActions.LoadJournal());
    const result = await firstValueFrom(effects.loadJournal$);
    expect(journalProvider.getJournal).toHaveBeenCalled();
    expect(journalProvider.saveJournalForOffline).toHaveBeenCalled();
    expect(slotProvider.detectSlotChanges).toHaveBeenCalled();
    expect(slotProvider.extendWithEmptyDays).toHaveBeenCalled();
    expect(slotProvider.getRelevantSlots).toHaveBeenCalled();
    expect(result.type === '[JournalPage] Load Journal Success').toBe(true);
  });

  it('should dispatch the success action when an error is thrown indicating HTTP 304 for the journal', async () => {
    vi.spyOn(journalProvider, 'getJournal');
    vi.spyOn(journalProvider, 'saveJournalForOffline');
    vi.spyOn(slotProvider, 'detectSlotChanges');
    vi.spyOn(slotProvider, 'extendWithEmptyDays');
    vi.spyOn(slotProvider, 'getRelevantSlots');
    (<any>journalProvider).setupHttp304Error();
    actions$.next(journalActions.LoadJournal());
    const result = await firstValueFrom(effects.loadJournal$);
    expect(journalProvider.getJournal).toHaveBeenCalled();
    expect(journalProvider.saveJournalForOffline).not.toHaveBeenCalled();
    expect(slotProvider.detectSlotChanges).not.toHaveBeenCalled();
    expect(slotProvider.extendWithEmptyDays).not.toHaveBeenCalled();
    expect(slotProvider.getRelevantSlots).not.toHaveBeenCalled();
    expect(result.type === '[JournalPage] Load Journal Success').toBe(true);
  });

  it('should save a log if a timeout error occurs', async () => {
    vi.spyOn(journalProvider, 'getJournal');
    vi.spyOn(journalProvider, 'saveJournalForOffline');
    vi.spyOn(slotProvider, 'detectSlotChanges');
    vi.spyOn(slotProvider, 'extendWithEmptyDays');
    vi.spyOn(slotProvider, 'getRelevantSlots');
    vi.spyOn(store$, 'dispatch');
    (<any>journalProvider).setupTimeoutError();
    actions$.next(journalActions.LoadJournal());
    const result = await firstValueFrom(effects.loadJournal$);
    expect(journalProvider.getJournal).toHaveBeenCalled();
    expect(journalProvider.saveJournalForOffline).not.toHaveBeenCalled();
    expect(slotProvider.detectSlotChanges).not.toHaveBeenCalledWith({}, JournalProviderMock.mockJournal);
    expect(slotProvider.extendWithEmptyDays).not.toHaveBeenCalled();
    expect(slotProvider.getRelevantSlots).not.toHaveBeenCalled();
    expect(result.type === '[JournalPage] Journal Refresh Error').toBe(true);
    expect(store$.dispatch).toHaveBeenCalledWith(journalActions.JournalRefresh(JournalRefreshModes.MANUAL));
  });

  it('should save a log if an actual error occurs', () => {
    // ARRANGE
    vi.spyOn(journalProvider, 'getJournal');
    vi.spyOn(journalProvider, 'saveJournalForOffline');
    vi.spyOn(slotProvider, 'detectSlotChanges');
    vi.spyOn(slotProvider, 'extendWithEmptyDays');
    vi.spyOn(slotProvider, 'getRelevantSlots');
    vi.spyOn(store$, 'dispatch');
    (<any>journalProvider).setupActualError();
    // ACT
    actions$.next(journalActions.LoadJournal());
    // ASSERT
    effects.loadJournal$.subscribe((result) => {
      expect(journalProvider.getJournal).toHaveBeenCalled();
      expect(journalProvider.saveJournalForOffline).not.toHaveBeenCalled();
      expect(slotProvider.detectSlotChanges).not.toHaveBeenCalledWith({}, JournalProviderMock.mockJournal);
      expect(slotProvider.extendWithEmptyDays).not.toHaveBeenCalled();
      expect(slotProvider.getRelevantSlots).not.toHaveBeenCalled();
      expect(result.type === '[JournalPage] Load Journal Success').toBe(false);
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.JournalRefresh(JournalRefreshModes.MANUAL));
      // expect(store$.dispatch).toHaveBeenCalledWith(expect.any(SaveLog));
    });
  });

  it('should dispatch the failure action when the journal fails to load', () => {
    // ARRANGE
    vi.spyOn(journalProvider, 'getJournal');
    vi.spyOn(slotProvider, 'detectSlotChanges');
    vi.spyOn(slotProvider, 'extendWithEmptyDays');
    vi.spyOn(slotProvider, 'getRelevantSlots');
    (<any>journalProvider).setupHttpError();
    // ACT
    actions$.next(journalActions.LoadJournal());
    // ASSERT
    effects.loadJournal$.subscribe((result) => {
      expect(journalProvider.getJournal).toHaveBeenCalled();
      expect(slotProvider.detectSlotChanges).toHaveBeenCalledTimes(0);
      expect(slotProvider.extendWithEmptyDays).toHaveBeenCalledTimes(0);
      expect(slotProvider.getRelevantSlots).toHaveBeenCalledTimes(0);

      if (result.type === '[JournalPage] Journal Refresh Error') {
        expect(result.type === '[JournalPage] Journal Refresh Error').toEqual(true);
      } else if (result.type === '[JournalEffects] Load Journal Failure') {
        expect(result.type === '[JournalEffects] Load Journal Failure').toEqual(true);
        expect((result as any).error.message).toBe('Http failure response for (unknown url): 403 Forbidden');
      } else {
        throw new Error('Unknown Action Sent', { cause: unitTestErrorCause });
      }
    });
  });

  it('should dispatch the SetSelectedDate action with the correct date in the select next day effect', () => {
    // ARRANGE
    const selectedDate: string = new DateTime().format('YYYY-MM-DD');
    const nextDay: string = DateTime.at(selectedDate).add(1, Duration.DAY).format('YYYY-MM-DD');
    store$.dispatch(journalActions.SetSelectedDate(selectedDate));
    store$.dispatch(
      journalActions.LoadJournalSuccess(
        { examiner: { staffNumber: '123', individualId: 456 }, slotItemsByDate: journalSlotsDataMock },
        NetworkConnectionStatus.ONLINE,
        false,
        new Date() // Load in mock journal state
      )
    );
    // ACT
    actions$.next(journalActions.SelectNextDay());
    // ASSERT
    effects.selectNextDayEffect$.subscribe((result) => {
      if (result.type === '[JournalEffects] Set Selected Day') {
        expect(result).toEqual(journalActions.SetSelectedDate(nextDay));
      }
      if (result.type === '[JournalPage] Navigate Day') {
        expect(result).toEqual(journalActions.JournalNavigateDay(nextDay));
      }
    });
  });

  it('should call the relevant methods and return correctly in the pollingSetup effect', async () => {
    vi.spyOn(networkStateProvider, 'onNetworkChange').mockReturnValue(of(NetworkConnectionStatus.ONLINE));
    vi.spyOn(appConfigProvider, 'getAppConfig').mockReturnValue({
      journal: { autoRefreshInterval: 200 },
    } as AppConfig);
    actions$.next(journalActions.SetupPolling());
    const result = await firstValueFrom(effects.pollingSetup$);
    expect(appConfigProvider.getAppConfig).toHaveBeenCalled();
    expect(networkStateProvider.onNetworkChange).toHaveBeenCalled();
    expect(result).toEqual({ type: '[JournalPage] Load Journal Silent' });
    actions$.next(journalActions.StopPolling());
  });

  describe('journalRehydration$', () => {
    it('should dispatch LoadRemoteTests and JournalRehydrationSuccess when rehydrated tests are returned', async () => {
      await new Promise<void>((done, reject) => {
        const mockSlot = {
          slotData: {
            slotDetail: { slotId: 123 },
            booking: {
              application: { applicationId: 999, bookingSequence: 1, checkDigit: 2, bookingReference: '999' },
            },
          },
        };

        const mockResponse: TestResultsRehydrated[] = [
          {
            autosave: 1,
            test_result: {
              journalData: {
                applicationReference: {
                  applicationId: 999,
                  bookingSequence: 1,
                  checkDigit: 2,
                  bookingReference: '999',
                },
                testSlotAttributes: { slotId: 123 } as TestSlotAttributes,
              } as JournalData,
            } as TestResultSchemasUnion,
          },
        ];

        const expectedMapped: TestResultRehydration[] = [
          {
            autosave: true,
            testData: mockResponse[0].test_result,
            slotId: '123',
          },
        ];

        vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        vi.spyOn(store$, 'select').mockImplementation((selector: unknown) => {
          if (selector === getTests) {
            return of({ testStatus: { 123: TestStatus.Booked } });
          }
          if (selector === getJournalState) {
            return of({ slots: [mockSlot] });
          }
          return of(null);
        });

        vi.spyOn(searchProvider, 'getTestResults').mockReturnValue(of({ body: mockResponse } as any));
        vi.spyOn(compressionProvider, 'compress');
        vi.spyOn(compressionProvider, 'extract').mockReturnValue(mockResponse);

        actions$.next(journalActions.JournalRehydration(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL));

        effects.journalRehydration$.subscribe(() => {
          try {
            expect(compressionProvider.compress).toHaveBeenCalled();
            expect(compressionProvider.extract).toHaveBeenCalled();
            expect(searchProvider.getTestResults).toHaveBeenCalled();
            expect(store$.dispatch).toHaveBeenCalledWith(LoadRemoteTests(expectedMapped));
            expect(store$.dispatch).toHaveBeenCalledWith(
              JournalRehydrationSuccess(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL)
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
    it('should dispatch JournalRehydrationNull when no eligible slots exist', async () => {
      await new Promise<void>((done, reject) => {
        vi.spyOn(searchProvider, 'getTestResults').mockReturnValue(of({} as HttpResponse<string>));
        vi.spyOn(compressionProvider, 'compress');
        vi.spyOn(compressionProvider, 'extract').mockReturnValue([]);
        vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        actions$.next(journalActions.JournalRehydration(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL));
        effects.journalRehydration$.subscribe(() => {
          try {
            expect(compressionProvider.compress).toHaveBeenCalled();
            expect(compressionProvider.extract).toHaveBeenCalled();
            expect(searchProvider.getTestResults).toHaveBeenCalled();
            expect(store$.dispatch).toHaveBeenCalledWith(
              JournalRehydrationNull(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL)
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
    it('should dispatch JournalRehydrationNull when provider returns no results', async () => {
      await new Promise<void>((done, reject) => {
        const mockSlot = {
          slotData: {
            slotDetail: { slotId: 123 },
            booking: { application: { applicationId: 999 } },
          },
        };

        vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        vi.spyOn(store$, 'select').mockImplementation((selector: unknown) => {
          if (selector === getTests) {
            return of({ testStatus: { 123: TestStatus.Booked } });
          }
          if (selector === getJournalState) {
            return of({ slots: [mockSlot] });
          }
          return of(null);
        });

        vi.spyOn(searchProvider, 'getTestResults').mockReturnValue(of({ body: [] } as any));
        vi.spyOn(compressionProvider, 'compress');
        vi.spyOn(compressionProvider, 'extract').mockReturnValue([]);

        actions$.next(journalActions.JournalRehydration(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL));

        effects.journalRehydration$.subscribe(() => {
          try {
            expect(store$.dispatch).toHaveBeenCalledWith(
              JournalRehydrationNull(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL)
            );
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });
});
