import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ReplaySubject, of } from 'rxjs';

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
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { SlotProvider } from '@providers/slot/slot';
import { DateTime, Duration } from '@shared/helpers/date-time';

import { HttpResponse } from '@angular/common/http';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { provideMockStore } from '@ngrx/store/testing';
import { CompletedTestPersistenceProviderMock } from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { CompressionProvider } from '@providers/compression/compression';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { LoadRemoteTests } from '@store/tests/tests.actions';
import { TestResultsRehydrated } from '@store/tests/tests.model';
import { TestResultRehydration } from '@store/tests/tests.reducer';
import * as journalActions from '../journal.actions';
import { JournalEffects, JournalRehydrationPage, JournalRehydrationType } from '../journal.effects';
import { JournalModel } from '../journal.model';
import { journalReducer } from '../journal.reducer';

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

  it('should dispatch the success action when the journal loads successfully', (done) => {
    // ARRANGE
    spyOn(journalProvider, 'getJournal').and.callThrough();
    spyOn(journalProvider, 'saveJournalForOffline').and.callThrough();
    spyOn(slotProvider, 'detectSlotChanges').and.callThrough();
    spyOn(slotProvider, 'extendWithEmptyDays').and.callThrough();
    spyOn(slotProvider, 'getRelevantSlots').and.callThrough();
    spyOn(compressionProvider, 'extract');
    spyOn(compressionProvider, 'compress');
    // ACT
    actions$.next(journalActions.LoadJournal());
    // ASSERT
    effects.loadJournal$.subscribe((result) => {
      expect(journalProvider.getJournal).toHaveBeenCalled();
      expect(journalProvider.saveJournalForOffline).toHaveBeenCalled();
      expect(slotProvider.detectSlotChanges).toHaveBeenCalled();
      expect(slotProvider.extendWithEmptyDays).toHaveBeenCalled();
      expect(slotProvider.getRelevantSlots).toHaveBeenCalled();
      expect(result.type === '[JournalPage] Load Journal Success').toBe(true);
      done();
    });
  });

  it('should dispatch the success action when an error is thrown indicating HTTP 304 for the journal', (done) => {
    // ARRANGE
    spyOn(journalProvider, 'getJournal').and.callThrough();
    spyOn(journalProvider, 'saveJournalForOffline').and.callThrough();
    spyOn(slotProvider, 'detectSlotChanges').and.callThrough();
    spyOn(slotProvider, 'extendWithEmptyDays').and.callThrough();
    spyOn(slotProvider, 'getRelevantSlots').and.callThrough();
    (<any>journalProvider).setupHttp304Error();
    // ACT
    actions$.next(journalActions.LoadJournal());
    // ASSERT
    effects.loadJournal$.subscribe((result) => {
      expect(journalProvider.getJournal).toHaveBeenCalled();
      expect(journalProvider.saveJournalForOffline).not.toHaveBeenCalled();
      expect(slotProvider.detectSlotChanges).not.toHaveBeenCalled();
      expect(slotProvider.extendWithEmptyDays).not.toHaveBeenCalled();
      expect(slotProvider.getRelevantSlots).not.toHaveBeenCalled();
      expect(result.type === '[JournalPage] Load Journal Success').toBe(true);
      done();
    });
  });

  it('should save a log if a timeout error occurs', (done) => {
    // ARRANGE
    spyOn(journalProvider, 'getJournal').and.callThrough();
    spyOn(journalProvider, 'saveJournalForOffline').and.callThrough();
    spyOn(slotProvider, 'detectSlotChanges').and.callThrough();
    spyOn(slotProvider, 'extendWithEmptyDays').and.callThrough();
    spyOn(slotProvider, 'getRelevantSlots').and.callThrough();
    spyOn(store$, 'dispatch').and.callThrough();
    (<any>journalProvider).setupTimeoutError();
    // ACT
    actions$.next(journalActions.LoadJournal());
    // ASSERT
    effects.loadJournal$.subscribe((result) => {
      expect(journalProvider.getJournal).toHaveBeenCalled();
      expect(journalProvider.saveJournalForOffline).not.toHaveBeenCalled();
      expect(slotProvider.detectSlotChanges).not.toHaveBeenCalledWith({}, JournalProviderMock.mockJournal);
      expect(slotProvider.extendWithEmptyDays).not.toHaveBeenCalled();
      expect(slotProvider.getRelevantSlots).not.toHaveBeenCalled();
      expect(result.type === '[JournalPage] Journal Refresh Error').toBe(true);
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.JournalRefresh(JournalRefreshModes.MANUAL));
      done();
    });
  });

  it('should save a log if an actual error occurs', () => {
    // ARRANGE
    spyOn(journalProvider, 'getJournal').and.callThrough();
    spyOn(journalProvider, 'saveJournalForOffline').and.callThrough();
    spyOn(slotProvider, 'detectSlotChanges').and.callThrough();
    spyOn(slotProvider, 'extendWithEmptyDays').and.callThrough();
    spyOn(slotProvider, 'getRelevantSlots').and.callThrough();
    spyOn(store$, 'dispatch').and.callThrough();
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
      // expect(store$.dispatch).toHaveBeenCalledWith(jasmine.any(SaveLog));
    });
  });

  it('should dispatch the failure action when the journal fails to load', () => {
    // ARRANGE
    spyOn(journalProvider, 'getJournal').and.callThrough();
    spyOn(slotProvider, 'detectSlotChanges').and.callThrough();
    spyOn(slotProvider, 'extendWithEmptyDays').and.callThrough();
    spyOn(slotProvider, 'getRelevantSlots').and.callThrough();
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
        fail('Unknown Action Sent');
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
        ConnectionStatus.ONLINE,
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

  it('should call the relevant methods and return correctly in the pollingSetup effect', (done) => {
    // ARRANGE
    spyOn(networkStateProvider, 'onNetworkChange').and.returnValue(of(ConnectionStatus.ONLINE)); // Force to online
    spyOn(appConfigProvider, 'getAppConfig').and.returnValue({
      journal: { autoRefreshInterval: 200 },
    } as AppConfig); // Set autoRefreshInterval to 200ms for test
    // ACT
    actions$.next(journalActions.SetupPolling());
    // ASSERT
    effects.pollingSetup$.subscribe((result) => {
      expect(appConfigProvider.getAppConfig).toHaveBeenCalled();
      expect(networkStateProvider.onNetworkChange).toHaveBeenCalled();
      expect(result).toEqual({ type: '[JournalPage] Load Journal Silent' });
      actions$.next(journalActions.StopPolling());
      done();
    });
  });

  describe('journalRehydration$', () => {
    it('should dispatch LoadRemoteTests with rehydrated tests for eligible slots', (done) => {
      const mockRehydratedResponse: TestResultsRehydrated[] = [
        {
          autosave: 1,
          test_result: {
            category: 'B',
            journalData: {
              testSlotAttributes: {
                slotId: 1,
              } as TestSlotAttributes,
            },
          } as TestResultSchemasUnion,
        },
      ];
      const mockRehydratedTestResults: TestResultRehydration[] = [
        {
          autosave: true,
          testData: {
            category: 'B',
            journalData: {
              testSlotAttributes: {
                slotId: 1,
              } as TestSlotAttributes,
            },
          } as TestResultSchemasUnion,
          slotId: '1',
        },
      ];

      spyOn(searchProvider, 'getTestResults').and.returnValue(of({} as HttpResponse<string>));
      spyOn(compressionProvider, 'compress').and.callThrough();
      spyOn(compressionProvider, 'extract').and.returnValue(mockRehydratedResponse);
      spyOn(store$, 'dispatch');

      actions$.next(journalActions.JournalRehydration(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL));
      effects.journalRehydration$.subscribe(() => {
        expect(compressionProvider.compress).toHaveBeenCalled();
        expect(compressionProvider.extract).toHaveBeenCalled();
        expect(searchProvider.getTestResults).toHaveBeenCalled();
        expect(store$.dispatch).toHaveBeenCalledWith(LoadRemoteTests(mockRehydratedTestResults));
        done();
      });
    });

    it('should not dispatch LoadRemoteTests when no slots are eligible for rehydration', (done) => {
      spyOn(searchProvider, 'getTestResults').and.returnValue(of({} as HttpResponse<string>));
      spyOn(compressionProvider, 'compress').and.callThrough();
      spyOn(compressionProvider, 'extract').and.returnValue([]);
      spyOn(store$, 'dispatch');
      actions$.next(journalActions.JournalRehydration(JournalRehydrationType.MANUAL, JournalRehydrationPage.JOURNAL));
      effects.journalRehydration$.subscribe(() => {
        expect(compressionProvider.compress).toHaveBeenCalled();
        expect(compressionProvider.extract).toHaveBeenCalled();
        expect(searchProvider.getTestResults).toHaveBeenCalled();
        expect(store$.dispatch).not.toHaveBeenCalledWith(LoadRemoteTests([]));
        done();
      });
    });
  });
});
