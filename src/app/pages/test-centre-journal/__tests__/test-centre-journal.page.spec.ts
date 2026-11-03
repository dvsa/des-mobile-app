import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ErrorMessageComponent } from '@components/common/error-message/error-message';
import { LoadingController } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppConfig } from '@providers/app-config/app-config.model';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { Subject, of, throwError } from 'rxjs';

import { LoadingControllerMock } from '@mocks/ionic-mocks/loading-controller.mock';
import { provideBasePageMocks } from '@mocks/test-providers';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { TestCentreJournalMock } from '@providers/test-centre-journal/__mocks__/test-centre-journal.mock';
import { TestCentreJournalProvider } from '@providers/test-centre-journal/test-centre-journal';
import { ErrorTypes } from '@shared/models/error-message';
import { LogType } from '@shared/models/log.model';
import { StoreModel } from '@shared/models/store.model';
import { TestCentre, TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';

import { HttpStatusCode } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RefreshButtonComponent } from '@components/common/refresh-button/refresh-button.component';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { MockComponent } from 'ng-mocks';

import { CandidateSearchCardComponent } from '../components/candidate-search-card/candidate-search-card';
import { TestCentreNameComponent } from '../components/test-centre-name/test-centre-name';
import { ViewJournalsCardComponent } from '../components/view-journals-card/view-journals-card';
import {
  TestCentreJournalGetData,
  TestCentreJournalTabChanged,
  TestCentreJournalViewDidEnter,
} from '../test-centre-journal.actions';
import { TestCentreJournalPage } from '../test-centre-journal.page';

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
    refData: { testCentres: { active: [], inactive: [] } },
  } as StoreModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MockComponent(RefreshButtonComponent),
        CommonModule,
        CandidateSearchCardComponent,
        TestCentreNameComponent,
        ViewJournalsCardComponent,
        RouterModule.forRoot([
          {
            path: '',
            component: TestCentreJournalPage,
          },
        ]),
        StoreModule.forRoot({}),
        TestCentreJournalPage,
        MockComponent(TestFlowHeaderComponent),
      ],
      providers: [
        provideBasePageMocks(),
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: TestCentreJournalProvider,
          useClass: TestCentreJournalMock,
        },
        {
          provide: LoadingController,
          useClass: LoadingControllerMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(TestCentreJournalPage);
    component = fixture.componentInstance;
    testCentreJournalProvider = TestBed.inject(TestCentreJournalProvider);
    logHelper = TestBed.inject(LogHelper);
    store$ = TestBed.inject(MockStore);
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    loadingController = TestBed.inject(LoadingController);
    spyOn(store$, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('asynchronous rendering', () => {
    const results: TestCentreDetailResponse = {
      staffNumber: '123',
      examiners: [],
      testCentres: [{ id: 1, name: 'Centre A' }],
    };

    it('should show both tabs when the journal response arrives without a forced refresh', async () => {
      const response$ = new Subject<TestCentreDetailResponse>();
      spyOn(testCentreJournalProvider, 'getTestCentreJournal').and.returnValue(response$);
      fixture.detectChanges();
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(fixture.debugElement.query(By.css('#candidate-search-tab'))).toBeNull();

      await component.getTestCentreData();
      response$.next(results);
      response$.complete();
      await fixture.whenStable();

      expect(fixture.debugElement.query(By.css('#candidate-search-tab'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#view-journals-tab'))).not.toBeNull();
      expect(component.testCentreNames).toBe('Centre A');
      expect(() => fixture.checkNoChanges()).not.toThrow();
    });

    it('should render errors and restore the tabs after a successful retry', async () => {
      const response$ = new Subject<TestCentreDetailResponse>();
      spyOn(testCentreJournalProvider, 'getTestCentreJournal').and.returnValues(response$, of(results));
      fixture.detectChanges();
      fixture.autoDetectChanges();
      await fixture.whenStable();
      await component.getTestCentreData();
      response$.error({ message: 'Journal failed', error: ErrorTypes.TEST_CENTRE_JOURNAL_ERROR });
      await fixture.whenStable();

      expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#candidate-search-tab'))).toBeNull();
      expect(() => fixture.checkNoChanges()).not.toThrow();

      await component.getTestCentreData();
      await fixture.whenStable();
      expect(fixture.debugElement.query(By.directive(ErrorMessageComponent))).toBeNull();
      expect(fixture.debugElement.query(By.css('#candidate-search-tab'))).not.toBeNull();
      expect(() => fixture.checkNoChanges()).not.toThrow();
    });

    it('should show LDTM tabs before a test centre is selected', async () => {
      spyOn(TestBed.inject(AppConfigProvider), 'getAppConfig').and.returnValue({
        role: ExaminerRole.LDTM,
      } as AppConfig);
      fixture.detectChanges();
      fixture.autoDetectChanges();
      await fixture.whenStable();
      expect(component.testCentreResults()).toBeNull();
      expect(fixture.debugElement.query(By.css('#candidate-search-tab'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#view-journals-tab'))).not.toBeNull();
      expect(() => fixture.checkNoChanges()).not.toThrow();
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
    it('should call getTestCentreData if not LDTM', async () => {
      spyOn(component, 'getTestCentreData');
      component.isLDTM = false;
      await component.ionViewWillEnter();
      expect(component.getTestCentreData).toHaveBeenCalled();
    });

    it('should not call getTestCentreData if LDTM', async () => {
      spyOn(component, 'getTestCentreData');
      component.isLDTM = true;
      await component.ionViewWillEnter();
      expect(component.getTestCentreData).not.toHaveBeenCalled();
    });

    it('should call monitorOrientation', async () => {
      spyOn(component.orientationMonitorProvider, 'monitorOrientation');
      await component.ionViewWillEnter();
      expect(component.orientationMonitorProvider.monitorOrientation).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should close subscriptions on page destroy', () => {
      spyOn(component.destroy$, 'next');
      spyOn(component.destroy$, 'complete');
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call tearDownListener', () => {
      spyOn(component.orientationMonitorProvider, 'tearDownListener');
      component.ionViewWillLeave();
      expect(component.orientationMonitorProvider.tearDownListener).toHaveBeenCalled();
    });
  });

  describe('getTestCentreData', () => {
    beforeEach(() => {
      spyOn(store$, 'dispatch');
      spyOn(component, 'setOfflineError');
      spyOn(component, 'mapError');
      spyOn(logHelper, 'createLog');
      spyOn(loadingController, 'create').and.callThrough();
      component.isOffline.set(false);
    });
    it('should set an offline error and not call getTestCentreJournal if in offline state', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal');
      component.isOffline.set(true);
      await component.getTestCentreData();
      expect(store$.dispatch).toHaveBeenCalledWith(TestCentreJournalGetData(false));
      expect(testCentreJournalProvider.getTestCentreJournal).not.toHaveBeenCalled();
    });
    it('should call getTestCentreJournal when online', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal').and.returnValue(of({}));
      await component.getTestCentreData();
      expect(testCentreJournalProvider.getTestCentreJournal).toHaveBeenCalled();
      expect(component.hasSearched()).toEqual(true);
      expect(component.testCentreResults()).toEqual({} as TestCentreDetailResponse);
      expect(component.showSearchSpinner()).toEqual(false);
      expect(component.didError()).toEqual(false);
    });
    it('should dispatch failure log and call map error when error is recognised', async () => {
      spyOn(testCentreJournalProvider, 'getTestCentreJournal').and.callFake(() => {
        return throwError(() => ({
          statusCode: HttpStatusCode.BadRequest,
          message: 'Some error',
          error: ErrorTypes.TEST_CENTRE_JOURNAL_ERROR,
        }));
      });
      await component.getTestCentreData();
      expect(testCentreJournalProvider.getTestCentreJournal).toHaveBeenCalled();
      expect(logHelper.createLog).toHaveBeenCalledWith(LogType.ERROR, 'Getting test centre journal', 'Some error');
      expect(component.didError()).toEqual(true);
      expect(component.testCentreResults()).toEqual(null);
      expect(component.showSearchSpinner()).toEqual(false);
      expect(component.mapError).toHaveBeenCalled();
    });
  });

  describe('get testCentreNames', () => {
    it('should concatenate all test centre names into a single string', () => {
      component.testCentreResults.set({
        testCentres: [{ name: 'Centre A' }, { name: 'Centre B' }, { name: 'Centre C' }] as TestCentre[],
      } as TestCentreDetailResponse);
      expect(component.testCentreNames).toEqual('Centre A, Centre B, Centre C');
    });
  });

  describe('tabChanged', () => {
    it('should dispatch the TestCentreJournalTabChanged action', () => {
      component.tabChanged('tab1');
      expect(store$.dispatch).toHaveBeenCalledWith(TestCentreJournalTabChanged('tab1'));
    });
  });
});
