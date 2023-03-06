import { of, ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { ReferenceDataProvider } from '@providers/reference-data/reference-data';
import { ReferenceDataEffects } from '@store/reference-data/reference-data.effects';
import { RefDataStateModel, referenceDataReducer } from '@store/reference-data/reference-data.reducer';
import { ReferenceDataProviderMock } from '@providers/reference-data/__mocks__/reference-data.mock';
import {
  GetTestCentresRefData,
  LoadTestCentresRefDataFail,
  LoadTestCentresRefDataSuccess,
  SetDateRefDataUpdated,
} from '@store/reference-data/reference-data.actions';
import { DateTime } from '@shared/helpers/date-time';

describe('ReferenceDataEffects', () => {
  let effects: ReferenceDataEffects;
  let actions$: ReplaySubject<any>;
  let referenceDataProvider: ReferenceDataProvider;
  let dateTimeProvider: DateTimeProvider;
  let store$: Store<RefDataStateModel>;
  let networkStateProvider: NetworkStateProvider;
  const mockTodayDate = '2023-02-22';
  const mockTomorrowDate = '2023-02-23';
  const mockTestCentres = {
    active: [], inactive: [],
  };

  beforeEach(waitForAsync(() => {
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
  }));

  describe('testCentreRefData$', () => {
    it('should not call getTestCentres when offline', () => {
    // ARRANGE
      spyOn(dateTimeProvider, 'now').and.returnValue(new DateTime(mockTomorrowDate));
      spyOn(networkStateProvider, 'getNetworkState').and.returnValue(ConnectionStatus.OFFLINE);
      // ACT
      actions$.next(GetTestCentresRefData());
      // ASSERT
      effects.testCentreRefData$.subscribe(() => {
        expect(referenceDataProvider.getTestCentres).not.toHaveBeenCalled();
      });
    });
    it('should not call getTestCentres when saved date is current date', () => {
      // ARRANGE
      spyOn(dateTimeProvider, 'now').and.returnValue(new DateTime(mockTodayDate));
      spyOn(networkStateProvider, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      store$.dispatch(SetDateRefDataUpdated(mockTodayDate));
      // ACT
      actions$.next(GetTestCentresRefData());
      // ASSERT
      effects.testCentreRefData$.subscribe(() => {
        expect(referenceDataProvider.getTestCentres).not.toHaveBeenCalled();
      });
    });
    it('should return value from getTestCentres and call LoadTestCentresRefDataSuccess with data', (done) => {
      spyOn(referenceDataProvider, 'getTestCentres').and.returnValue(of(mockTestCentres));
      // ARRANGE
      spyOn(dateTimeProvider, 'now').and.returnValue(new DateTime(mockTomorrowDate));
      spyOn(networkStateProvider, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      store$.dispatch(SetDateRefDataUpdated(mockTodayDate));
      // ACT
      actions$.next(GetTestCentresRefData());
      // ASSERT
      effects.testCentreRefData$.subscribe((action) => {
        expect(referenceDataProvider.getTestCentres).toHaveBeenCalled();
        expect(action.type).toEqual(LoadTestCentresRefDataSuccess(mockTestCentres).type);
        done();
      });
    });
    it('should throw error from getTestCentres and call LoadTestCentresRefDataFail', (done) => {
      spyOn(referenceDataProvider, 'getTestCentres').and.throwError(new Error('some error'));
      // ARRANGE
      store$.dispatch(SetDateRefDataUpdated(mockTodayDate));
      spyOn(dateTimeProvider, 'now').and.returnValue(new DateTime(mockTomorrowDate));
      spyOn(networkStateProvider, 'getNetworkState').and.returnValue(ConnectionStatus.ONLINE);
      // ACT
      actions$.next(GetTestCentresRefData());
      // ASSERT
      effects.testCentreRefData$.subscribe((action) => {
        expect(referenceDataProvider.getTestCentres).toHaveBeenCalled();
        expect(action.type).toEqual(LoadTestCentresRefDataFail().type);
        done();
      });
    });
  });
  describe('testCentreRefDataSuccess$', () => {
    it('should call SetDateRefDataUpdated with date', (done) => {
      // ACT
      actions$.next(LoadTestCentresRefDataSuccess(mockTestCentres));
      // ASSERT
      effects.testCentreRefDataSuccess$.subscribe((action) => {
        expect(action.type).toEqual(SetDateRefDataUpdated(mockTodayDate).type);
        done();
      });
    });
  });
});
