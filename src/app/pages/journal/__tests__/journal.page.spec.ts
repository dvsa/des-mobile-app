import {
  async, ComponentFixture, fakeAsync, flushMicrotasks, TestBed,
} from '@angular/core/testing';
import {
  IonicModule, LoadingController, ModalController, NavParams, Platform,
} from '@ionic/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFactoryResolver } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { JournalPage } from '../journal.page';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../../providers/authentication/__mocks__/authentication.mock';
import { SlotSelectorProvider } from '../../../providers/slot-selector/slot-selector';
import { DateTimeProvider } from '../../../providers/date-time/date-time';
import { DateTimeProviderMock } from '../../../providers/date-time/__mocks__/date-time.mock';
import { AppConfigProvider } from '../../../providers/app-config/app-config';
import { AppConfigProviderMock } from '../../../providers/app-config/__mocks__/app-config.mock';
import { AppComponent } from '../../../app.component';
import { StoreModel } from '../../../shared/models/store.model';
import { LoadingControllerMock } from '../../../../../mock/ionic-mocks/loading-controller.mock';
import { MockAppComponent } from '../../../__mocks__/app.component.mock';
import { JournalNavigationComponent } from '../components/journal-navigation/journal-navigation';
import { selectVersionNumber } from '../../../../store/app-info/app-info.selectors';
import { DateTime } from '../../../shared/helpers/date-time';
import * as journalActions from '../../../../store/journal/journal.actions';
import { MesError } from '../../../shared/models/mes-error.model';
import { ErrorPage } from '../../error-page/error';
import { ErrorTypes } from '../../../shared/models/error-message';
import { MockBackButton } from './back-button.mock';
import { MockPlatform } from './platform.mock';

describe('JournalPage', () => {
  let component: JournalPage;
  let fixture: ComponentFixture<JournalPage>;
  let mockBackButton; let
    mockPlatform;
  const platformReadySpy = jasmine.createSpy().and.returnValue(Promise.resolve());
  let store$: MockStore;
  const initialState = {
    appInfo: {
      versionNumber: '4.0',
    },
  } as StoreModel;
  const mockNavParams = {
    get: (param: string) => {
      const data = {};
      return data[param];
    },
  };

  beforeEach(async(() => {
    mockBackButton = new MockBackButton();
    mockBackButton.subscribeWithPriority = jasmine.createSpy('subscribeWithPriority', () => {
    });
    mockPlatform = new MockPlatform();
    mockPlatform.backButton = mockBackButton;
    mockPlatform.ready = platformReadySpy;

    const modalSpy = jasmine.createSpyObj('Modal', ['present']);
    const modalControllerMock = jasmine.createSpyObj('ModalController', ['create']);
    modalControllerMock.create.and.callFake(() => {
      return modalSpy;
    });

    TestBed.configureTestingModule({
      declarations: [
        JournalPage,
        MockComponent(JournalNavigationComponent),
      ],
      imports: [
        IonicModule,
        RouterTestingModule.withRoutes(
          [
            { path: '', component: JournalPage },
          ],
        ),
      ],
      providers: [
        { provide: Platform, useValue: mockPlatform },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: ModalController, useValue: modalControllerMock },
        { provide: NavParams, useValue: mockNavParams },
        { provide: LoadingController, useClass: LoadingControllerMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: AppComponent, useClass: MockAppComponent },
        SlotSelectorProvider,
        ComponentFactoryResolver,
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JournalPage);
    component = fixture.componentInstance;
    component.subscription = new Subscription();
    fixture.detectChanges();
    store$ = TestBed.inject(MockStore);
  }));

  describe('Should be correctly configured', () => {
    it('should be created successfully', () => {
      expect(component instanceof JournalPage).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should test ngOnInit', () => {
      const spy = spyOn(store$, 'select');
      component.ngOnInit();
      expect(spy.calls.allArgs()).toEqual([
        [selectVersionNumber],
      ]);
    });
  });

  describe('ionViewWillEnter', () => {
    it('should call loadJournalManually, setupPolling and set todays date', () => {
      spyOn(component, 'loadJournalManually');
      spyOn(component, 'setupPolling');
      component.merged$ = null;
      component.ionViewWillEnter();
      expect(component.loadJournalManually).toHaveBeenCalled();
      expect(component.setupPolling).toHaveBeenCalled();
      expect(component.todaysDate).toEqual(new DateTime('2019-02-01'));
    });
  });

  describe('ionViewWillLeave', () => {
    it('should dispatch action to stop polling', () => {
      spyOn(store$, 'dispatch').and.stub();
      component.ionViewWillLeave();
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.StopPolling());
    });
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch action JournalViewDidEnter', () => {
      spyOn(store$, 'dispatch').and.stub();
      component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.JournalViewDidEnter());
    });
  });

  describe('loadJournalManually', () => {
    it('should dispatch action LoadJournal', () => {
      spyOn(store$, 'dispatch').and.stub();
      component.loadJournalManually();
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.LoadJournal());
    });
  });

  describe('setupPolling', () => {
    it('should dispatch action SetupPolling', () => {
      spyOn(store$, 'dispatch').and.stub();
      component.setupPolling();
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.SetupPolling());
    });
  });

  describe('setSelectedDate', () => {
    it('should set selectedDate to passed in value', () => {
      component.setSelectedDate('2021-01-01');
      expect(component.selectedDate).toEqual('2021-01-01');
    });
  });

  describe('setCompletedTests', () => {
    it('should set completedTests to passed in value', () => {
      component.setCompletedTests(
        [{ costCode: 'abc' }] as SearchResultTestSchema[],
      );
      expect(component.completedTests).toEqual([{ costCode: 'abc' }] as SearchResultTestSchema[]);
    });
  });

  describe('showError', () => {
    it('should create a modal instance if there is an error', fakeAsync(() => {
      const errorMessage: MesError = {
        message: 'Error',
        status: 500,
        statusText: 'Something went wrong',
      };

      spyOn(component.modalController, 'create');
      component.showError(errorMessage);
      flushMicrotasks();

      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ErrorPage,
        cssClass: 'modal-fullscreen text-zoom-regular',
        componentProps: {
          errorType: ErrorTypes.JOURNAL_REFRESH,
        },
      });
    }));
  });

});
