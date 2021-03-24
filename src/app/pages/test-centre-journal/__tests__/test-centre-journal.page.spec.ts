import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';

import { TestCentreJournalPage } from '../test-centre-journal.page';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../../providers/authentication/__mocks__/authentication.mock';
import { NetworkStateProvider } from '../../../providers/network-state/network-state';
import { NetworkStateProviderMock } from '../../../providers/network-state/__mocks__/network-state.mock';
import { TestCentreJournalMock } from '../../../providers/test-centre-journal/__mocks__/test-centre-journal.mock';
import { TestCentreJournalProvider } from '../../../providers/test-centre-journal/test-centre-journal';
import { LogHelperMock } from '../../../providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '../../../providers/logs/logs-helper';
import { StoreModel } from '../../../shared/models/store.model';
import { ComponentsModule } from '../../../../components/common/common-components.module';
import { TestCentreJournalGetData, TestCentreJournalViewDidEnter } from '../test-centre-journal.actions';
import { TestCentreDetailResponse } from '../../../shared/models/test-centre-journal.model';
import { LogType } from '../../../shared/models/log.model';
import { BasePageComponent } from '../../../shared/classes/base-page';
import { ErrorTypes } from '../../../shared/models/error-message';
import { TestCentreJournalComponentsModule } from '../components/test-centre-journal-components.module';
import { LoadingControllerMock } from '../../../../../mock/ionic-mocks/loading-controller.mock';

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
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TestCentreJournalPage],
      imports: [
        IonicModule,
        CommonModule,
        ComponentsModule,
        TestCentreJournalComponentsModule,
        RouterTestingModule.withRoutes(
          [
            { path: '', component: TestCentreJournalPage },
          ],
        ),
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
        { provide: TestCentreJournalProvider, useClass: TestCentreJournalMock },
        { provide: LoadingController, useClass: LoadingControllerMock },
        provideMockStore({ initialState }),
      ],
    });
  });
  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestCentreJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testCentreJournalProvider = TestBed.inject(TestCentreJournalProvider);
    logHelper = TestBed.inject(LogHelper);
    store$ = TestBed.inject(MockStore);
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    loadingController = TestBed.inject(LoadingController);
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should set the isOffline$ property to a local isOffline', () => {
      spyOnProperty(networkStateProvider.isOffline$, 'value', 'get').and.returnValue(true);
      component.ngOnInit();
      expect(component.isOffline).toEqual(true);
    });
  });
  describe('ionViewDidEnter', () => {
    it('should dispatch the view did enter action', () => {
      spyOn(store$, 'dispatch');
      component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(TestCentreJournalViewDidEnter());
    });
  });
  describe('ionViewWillEnter', () => {
    it('should call through to base page ionViewWillEnter and call getTestCentreData', () => {
      spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
      spyOn(component, 'getTestCentreData');
      component.ionViewWillEnter();
      expect(BasePageComponent.prototype.ionViewWillEnter).toHaveBeenCalled();
      expect(component.getTestCentreData).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('should close subscriptions on page destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
  describe('getTestCentreData', () => {
    beforeEach(() => {
      spyOn(store$, 'dispatch');
      spyOn<any>(component, 'setOfflineError');
      spyOn<any>(component, 'mapError');
      spyOn(logHelper, 'createLog');
      spyOn(loadingController, 'create').and.callThrough();
      component.isOffline = false;
    });
    it('should set an offline error and not call getTestCentreJournal if in offline state', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal');
      component.isOffline = true;
      await component.getTestCentreData();
      expect(store$.dispatch).toHaveBeenCalledWith(TestCentreJournalGetData());
      expect(testCentreJournalProvider.getTestCentreJournal).not.toHaveBeenCalled();
    });
    it('should call getTestCentreJournal when online', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal').and.returnValue(of({}));
      await component.getTestCentreData();
      expect(testCentreJournalProvider.getTestCentreJournal).toHaveBeenCalled();
      expect(component.hasSearched).toEqual(true);
      expect(component.testCentreResults).toEqual({} as TestCentreDetailResponse);
      expect(component.showSearchSpinner).toEqual(false);
      expect(component.didError).toEqual(false);
    });
    it('should dispatch failure log and call map error when error is recognised', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal').and.callFake(() => {
        return throwError({ statusCode: 400, message: 'Some error', error: ErrorTypes.TEST_CENTRE_JOURNAL_ERROR });
      });
      await component.getTestCentreData();
      expect(testCentreJournalProvider.getTestCentreJournal).toHaveBeenCalled();
      expect(logHelper.createLog).toHaveBeenCalledWith(
        LogType.ERROR,
        'Getting test centre journal',
        'Some error',
      );
      expect(component.didError).toEqual(true);
      expect(component.testCentreResults).toEqual(null);
      expect(component.showSearchSpinner).toEqual(false);
      expect(component['mapError']).toHaveBeenCalled();
    });
  });
});
