import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { of, ReplaySubject } from 'rxjs';

import { journalReducer } from '../journal.reducer';
import * as journalActions from '../journal.actions';
import { JournalEffects } from '../journal.effects';
import { JournalProvider } from '../../../app/providers/journal/journal';
import { SlotProvider } from '../../../app/providers/slot/slot';
import { ConnectionStatus, NetworkStateProvider } from '../../../app/providers/network-state/network-state';
import { AppConfigProvider } from '../../../app/providers/app-config/app-config';
import { JournalProviderMock } from '../../../app/providers/journal/__mocks__/journal.mock';
import { AppConfigProviderMock } from '../../../app/providers/app-config/__mocks__/app-config.mock';
import { NetworkStateProviderMock } from '../../../app/providers/network-state/__mocks__/network-state.mock';
import { DataStoreProviderMock } from '../../../app/providers/data-store/__mocks__/data-store.mock';
import { DataStoreProvider } from '../../../app/providers/data-store/data-store';
import { AuthenticationProvider } from '../../../app/providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../../app/providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '../../../app/providers/date-time/date-time';
import { DateTimeProviderMock } from '../../../app/providers/date-time/__mocks__/date-time.mock';
import { LogHelperMock } from '../../../app/providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '../../../app/providers/logs/logs-helper';
import { JournalModel } from '../journal.model';
import { JournalRefreshModes } from '../../../app/providers/analytics/analytics.model';
import { DateTime, Duration } from '../../../app/shared/helpers/date-time';
import journalSlotsDataMock from '../../../app/providers/journal/__mocks__/journal-slots-data.mock';
import { AppConfig } from '../../../app/providers/app-config/app-config.model';

describe('Journal Effects', () => {

  let effects: JournalEffects;
  let actions$: any;
  let journalProvider: JournalProvider;
  let slotProvider: SlotProvider;
  let store$: Store<JournalModel>;
  let networkStateProvider: NetworkStateProvider;
  let appConfigProvider: AppConfigProvider;

  configureTestSuite(() => {
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
        // { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
        Store,
        SlotProvider,
      ],
    });
  });

  beforeEach(() => {
    // ARRANGE
    actions$ = new ReplaySubject(1);
    journalProvider = TestBed.get(JournalProvider);
    (journalProvider as any).resetErrors();
    effects = TestBed.get(JournalEffects);
    slotProvider = TestBed.get(SlotProvider);
    store$ = TestBed.get(Store);
    networkStateProvider = TestBed.get(NetworkStateProvider);
    appConfigProvider = TestBed.get(AppConfigProvider);
  });

  it('should dispatch the success action when the journal loads successfully', (done) => {
    // ARRANGE
    spyOn(journalProvider, 'getJournal').and.callThrough();
    spyOn(journalProvider, 'saveJournalForOffline').and.callThrough();
    spyOn(slotProvider, 'detectSlotChanges').and.callThrough();
    spyOn(slotProvider, 'extendWithEmptyDays').and.callThrough();
    spyOn(slotProvider, 'getRelevantSlots').and.callThrough();
    // ACT
    actions$.next(journalActions.LoadJournal());
    // ASSERT
    effects.loadJournal$.subscribe((result) => {
      expect(journalProvider.getJournal).toHaveBeenCalled();
      // TODO: Reinstate when offline functionality is done
      // expect(journalProvider.saveJournalForOffline).toHaveBeenCalled();
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
      // TODO: Reinstate when offline functionality is done
      // expect(journalProvider.saveJournalForOffline).not.toHaveBeenCalled();
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
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.JournalRefresh({
        mode: JournalRefreshModes.MANUAL,
      }));
      done();
    });
  });

  it('should save a log if an actual error occurs', (done) => {
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
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.JournalRefresh({
        mode: JournalRefreshModes.MANUAL,
      }));
      // expect(store$.dispatch).toHaveBeenCalledWith(jasmine.any(SaveLog));
      done();
    });
  });

  it('should dispatch the failure action when the journal fails to load', (done) => {
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
        expect((result as any).message).toBe('Http failure response for (unknown url): 403 Forbidden');
      } else {
        fail('Unknown Action Sent');
      }
      done();
    });
  });

  it('should dispatch the SetSelectedDate action with the correct date in the select next day effect', (done) => {
    // ARRANGE
    const selectedDate: string = new DateTime().format('YYYY-MM-DD');
    const nextDay: string = DateTime.at(selectedDate).add(1, Duration.DAY).format('YYYY-MM-DD');
    store$.dispatch(journalActions.SetSelectedDate(selectedDate));
    store$.dispatch(journalActions.LoadJournalSuccess(
    { examiner: { staffNumber: '123', individualId: 456 }, slotItemsByDate: journalSlotsDataMock },
      ConnectionStatus.ONLINE,
      false,
      new Date(), // Load in mock journal state
    ));
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
      done();
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

});
