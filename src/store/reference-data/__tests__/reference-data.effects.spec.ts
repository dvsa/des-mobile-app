import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ReplaySubject, firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { NetworkConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { ReferenceDataProviderMock } from '@providers/reference-data/__mocks__/reference-data.mock';
import { ReferenceDataProvider } from '@providers/reference-data/reference-data';
import { DateTime } from '@shared/helpers/date-time';
import {
  GetTestCentresRefData,
  LoadTestCentresRefDataFail,
  LoadTestCentresRefDataSuccess,
  SetDateRefDataUpdated,
} from '@store/reference-data/reference-data.actions';
import { ReferenceDataEffects } from '@store/reference-data/reference-data.effects';
import { RefDataStateModel, referenceDataReducer } from '@store/reference-data/reference-data.reducer';
import { unitTestErrorCause } from '../../../test-setup.vitest';

describe('ReferenceDataEffects', () => {
  let effects: ReferenceDataEffects;
  let actions$: ReplaySubject<unknown>;
  let referenceDataProvider: ReferenceDataProvider;
  let dateTimeProvider: DateTimeProvider;
  let store$: Store<RefDataStateModel>;
  let networkStateProvider: NetworkStateProvider;
  const mockTodayDate = '2023-02-22';
  const mockTomorrowDate = '2023-02-23';
  const mockTestCentres = {
    active: [],
    inactive: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          refData: referenceDataReducer,
        }),
      ],
      providers: [
        ReferenceDataEffects,
        provideMockActions(() => actions$),
        { provide: ReferenceDataProvider, useClass: ReferenceDataProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    referenceDataProvider = TestBed.inject(ReferenceDataProvider);
    effects = TestBed.inject(ReferenceDataEffects);
    store$ = TestBed.inject(Store);
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    dateTimeProvider = TestBed.inject(DateTimeProvider);
  });

  describe('testCentreRefData$', () => {
    it('should not call getTestCentres when offline', () => {
      // ARRANGE
      vi.spyOn(dateTimeProvider, 'now').mockReturnValue(new DateTime(mockTomorrowDate));
      vi.spyOn(networkStateProvider, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.OFFLINE);
      // ACT
      actions$.next(GetTestCentresRefData());
      // ASSERT
      effects.testCentreRefData$.subscribe(() => {
        expect(referenceDataProvider.getTestCentres).not.toHaveBeenCalled();
      });
    });
    it('should not call getTestCentres when saved date is current date', () => {
      // ARRANGE
      vi.spyOn(dateTimeProvider, 'now').mockReturnValue(new DateTime(mockTodayDate));
      vi.spyOn(networkStateProvider, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);
      store$.dispatch(SetDateRefDataUpdated(mockTodayDate));
      // ACT
      actions$.next(GetTestCentresRefData());
      // ASSERT
      effects.testCentreRefData$.subscribe(() => {
        expect(referenceDataProvider.getTestCentres).not.toHaveBeenCalled();
      });
    });
    it('should return value from getTestCentres and call LoadTestCentresRefDataSuccess with data', async () => {
      vi.spyOn(referenceDataProvider, 'getTestCentres').mockReturnValue(of(mockTestCentres));
      vi.spyOn(dateTimeProvider, 'now').mockReturnValue(new DateTime(mockTomorrowDate));
      vi.spyOn(networkStateProvider, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);
      store$.dispatch(SetDateRefDataUpdated(mockTodayDate));
      actions$.next(GetTestCentresRefData());
      const action = await firstValueFrom(effects.testCentreRefData$);
      expect(referenceDataProvider.getTestCentres).toHaveBeenCalled();
      expect(action.type).toEqual(LoadTestCentresRefDataSuccess(mockTestCentres).type);
    });
    it('should throw error from getTestCentres and call LoadTestCentresRefDataFail', async () => {
      vi.spyOn(referenceDataProvider, 'getTestCentres').mockImplementation(() => {
        throw new Error('some error', { cause: unitTestErrorCause });
      });
      store$.dispatch(SetDateRefDataUpdated(mockTodayDate));
      vi.spyOn(dateTimeProvider, 'now').mockReturnValue(new DateTime(mockTomorrowDate));
      vi.spyOn(networkStateProvider, 'getNetworkState').mockReturnValue(NetworkConnectionStatus.ONLINE);
      actions$.next(GetTestCentresRefData());
      const action = await firstValueFrom(effects.testCentreRefData$);
      expect(referenceDataProvider.getTestCentres).toHaveBeenCalled();
      expect(action.type).toEqual(LoadTestCentresRefDataFail().type);
    });
  });
  describe('testCentreRefDataSuccess$', () => {
    it('should call SetDateRefDataUpdated with date', async () => {
      actions$.next(LoadTestCentresRefDataSuccess(mockTestCentres));
      const action = await firstValueFrom(effects.testCentreRefDataSuccess$);
      expect(action.type).toEqual(SetDateRefDataUpdated(mockTodayDate).type);
    });
  });
});
