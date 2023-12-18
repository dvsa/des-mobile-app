import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { TestCentreJournalMock } from '@providers/test-centre-journal/__mocks__/test-centre-journal.mock';
import { TestCentreJournalProvider } from '@providers/test-centre-journal/test-centre-journal';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { StoreModel } from '@shared/models/store.model';
import { TestCentre, TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { LogType } from '@shared/models/log.model';
import { BasePageComponent } from '@shared/classes/base-page';
import { ErrorTypes } from '@shared/models/error-message';
import { ComponentsModule } from '@components/common/common-components.module';
import { LoadingControllerMock } from '@mocks/ionic-mocks/loading-controller.mock';

import {
  TestCentreJournalGetData,
  TestCentreJournalTabChanged,
  TestCentreJournalViewDidEnter,
} from '../test-centre-journal.actions';
import { TestCentreJournalPage } from '../test-centre-journal.page';
import { TestCentreJournalComponentsModule } from '../components/test-centre-journal-components.module';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteMock } from '@mocks/angular-mocks/activated-route.mock';
import { HttpStatusCode } from '@angular/common/http';

describe('TestCenterJournalPage', () => {
  let component: TestCentreJournalPage;
  let fixture: ComponentFixture<TestCentreJournalPage>;
  let testCentreJournalProvider: TestCentreJournalProvider;
  let networkStateProvider: NetworkStateProvider;
  let loadingController: LoadingController;
  let logHelper: LogHelper;
  let store$: MockStore;
  const initialState = {
    testCentreJournal: { lastRefreshed: new Date('2021-03-22') },
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestCentreJournalPage],
      imports: [
        IonicModule,
        CommonModule,
        ComponentsModule,
        TestCentreJournalComponentsModule,
        RouterTestingModule.withRoutes(
          [
            {
              path: '',
              component: TestCentreJournalPage,
            },
          ],
        ),
        StoreModule.forRoot({}),
      ],
      providers: [
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: TestCentreJournalProvider,
          useClass: TestCentreJournalMock,
        },
        {
          provide: LoadingController,
          useClass: LoadingControllerMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(TestCentreJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testCentreJournalProvider = TestBed.inject(TestCentreJournalProvider);
    logHelper = TestBed.inject(LogHelper);
    store$ = TestBed.inject(MockStore);
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    loadingController = TestBed.inject(LoadingController);
    spyOn(store$, 'dispatch');
  }));
  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should set the isOffline$ property to a local isOffline', () => {
      spyOnProperty(networkStateProvider.isOffline$, 'value', 'get')
        .and
        .returnValue(true);
      component.ngOnInit();
      expect(component.isOffline)
        .toEqual(true);
    });
  });
  describe('ionViewDidEnter', () => {
    it('should dispatch the view did enter action', () => {
      spyOn(store$, 'dispatch');
      component.ionViewDidEnter();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(TestCentreJournalViewDidEnter());
    });
  });
  describe('ionViewWillEnter', () => {
    it('should call through to base page ionViewWillEnter and call getTestCentreData', () => {
      spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
      spyOn(component, 'getTestCentreData');
      component.ionViewWillEnter();
      expect(BasePageComponent.prototype.ionViewWillEnter)
        .toHaveBeenCalled();
      expect(component.getTestCentreData)
        .toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('should close subscriptions on page destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component['destroy$'].next)
        .toHaveBeenCalled();
      expect(component['destroy$'].complete)
        .toHaveBeenCalled();
      expect(component.subscription.unsubscribe)
        .toHaveBeenCalled();
    });
  });
  describe('ionViewWillLeave', () => {
    it('should call tearDownListener', () => {
      spyOn(component.orientationMonitorProvider, 'tearDownListener');
      component.ionViewWillLeave();
      expect(component.orientationMonitorProvider.tearDownListener)
        .toHaveBeenCalled();
    });
  });
  describe('getTestCentreData', () => {
    beforeEach(() => {
      spyOn(store$, 'dispatch');
      spyOn<any>(component, 'setOfflineError');
      spyOn<any>(component, 'mapError');
      spyOn(logHelper, 'createLog');
      spyOn(loadingController, 'create')
        .and
        .callThrough();
      component.isOffline = false;
    });
    it('should set an offline error and not call getTestCentreJournal if in offline state', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal');
      component.isOffline = true;
      await component.getTestCentreData();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(TestCentreJournalGetData(false));
      expect(testCentreJournalProvider.getTestCentreJournal)
        .not
        .toHaveBeenCalled();
    });
    it('should call getTestCentreJournal when online', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal')
        .and
        .returnValue(of({}));
      await component.getTestCentreData();
      expect(testCentreJournalProvider.getTestCentreJournal)
        .toHaveBeenCalled();
      expect(component.hasSearched)
        .toEqual(true);
      expect(component.testCentreResults)
        .toEqual({} as TestCentreDetailResponse);
      expect(component.showSearchSpinner)
        .toEqual(false);
      expect(component.didError)
        .toEqual(false);
    });
    it('should dispatch failure log and call map error when error is recognised', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal')
        .and
        .callFake(() => {
          return throwError(() => ({
            statusCode: HttpStatusCode.BadRequest,
            message: 'Some error',
            error: ErrorTypes.TEST_CENTRE_JOURNAL_ERROR,
          }));
        });
      await component.getTestCentreData();
      expect(testCentreJournalProvider.getTestCentreJournal)
        .toHaveBeenCalled();
      expect(logHelper.createLog)
        .toHaveBeenCalledWith(
          LogType.ERROR,
          'Getting test centre journal',
          'Some error',
        );
      expect(component.didError)
        .toEqual(true);
      expect(component.testCentreResults)
        .toEqual(null);
      expect(component.showSearchSpinner)
        .toEqual(false);
      expect(component['mapError'])
        .toHaveBeenCalled();
    });
  });
  describe('get testCentreNames', () => {
    it('should concatenate all test centre names into a single string', () => {
      component.testCentreResults = {
        testCentres: [
          { name: 'Centre A' },
          { name: 'Centre B' },
          { name: 'Centre C' },
        ] as TestCentre[],
      } as TestCentreDetailResponse;
      expect(component.testCentreNames)
        .toEqual('Centre A, Centre B, Centre C');
    });
  });
  describe('tabChanged', () => {
    it('should dispatch the TestCentreJournalTabChanged action', () => {
      component.tabChanged('tab1');
      expect(store$.dispatch)
        .toHaveBeenCalledWith(TestCentreJournalTabChanged('tab1'));
    });
  });
});
