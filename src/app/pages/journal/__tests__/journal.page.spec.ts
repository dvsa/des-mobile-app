import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonRefresher, ModalController, Platform } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Subscription } from 'rxjs';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { JournalPage } from '@pages/journal/journal.page';
import { JournalComponentsModule } from '@pages/journal/components/journal-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { journalReducer } from '@store/journal/journal.reducer';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { SlotProvider } from '@providers/slot/slot';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import {
  CompletedTestPersistenceProviderMock,
} from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { BasePageComponent } from '@shared/classes/base-page';
import * as journalActions from '@store/journal/journal.actions';
import { MesError } from '@shared/models/mes-error.model';
import { ErrorPage } from '@pages/error-page/error';
import { ErrorTypes } from '@shared/models/error-message';
import journalSlotsDataMock from '@store/journal/__mocks__/journal-slots-data.mock';
import { By } from '@angular/platform-browser';
import { DeviceProvider } from '@providers/device/device';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { LoadingProvider } from '@providers/loader/loader';
import { LoaderProviderMock } from '@providers/loader/__mocks__/loader.mock';
import { LoadingOptions } from '@ionic/core';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';

describe('JournalPage', () => {
  let fixture: ComponentFixture<JournalPage>;
  let component: JournalPage;
  let store$: Store<StoreModel>;
  let insomnia: Insomnia;
  let deviceProvider: DeviceProvider;
  let loaderService: LoadingProvider;
  let completedTestPersistenceProvider: CompletedTestPersistenceProvider;
  const loadingOpts: LoadingOptions = {
    id: 'journal_loading_spinner',
    spinner: 'circles',
    backdropDismiss: true,
    translucent: false,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        JournalPage,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        JournalComponentsModule,
        TestSlotComponentsModule,
        StoreModule.forRoot({
          journal: journalReducer,
        }),
      ],
      providers: [
        OrientationMonitorProvider,
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: LoadingProvider,
          useClass: LoaderProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: SlotProvider,
          useClass: SlotProviderMock,
        },
        {
          provide: SlotSelectorProvider,
          useClass: SlotSelectorProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: AppComponent,
          useClass: MockAppComponent,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: Insomnia,
          useClass: InsomniaMock,
        },
        {
          provide: CompletedTestPersistenceProvider,
          useClass: CompletedTestPersistenceProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(JournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.subscription = new Subscription();
    insomnia = TestBed.inject(Insomnia);
    deviceProvider = TestBed.inject(DeviceProvider);
    completedTestPersistenceProvider = TestBed.inject(CompletedTestPersistenceProvider);
    store$ = TestBed.inject(Store);
    loaderService = TestBed.inject(LoadingProvider);
    spyOn(store$, 'dispatch');
    spyOn(loaderService, 'handleUILoading');
    spyOn(BasePageComponent.prototype, 'isIos')
      .and
      .returnValue(true);
  }));

  describe('Class', () => {
    it('should create component', () => {
      expect(component)
        .toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should dispatch an UnloadJournal action and call base page logout', () => {
      spyOn(BasePageComponent.prototype, 'logout');
      component.logout();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(journalActions.UnloadJournal());
      expect(BasePageComponent.prototype.logout)
        .toHaveBeenCalled();
    });
  });

  describe('loadJournalManually', () => {
    it('should dispatch a LoadJournal action', async () => {
      await component.loadJournalManually();
      expect(loaderService.handleUILoading)
        .toHaveBeenCalledWith(true, loadingOpts);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(journalActions.LoadJournal());
    });
  });

  describe('setupPolling', () => {
    it('should dispatch a setupPolling action', () => {
      component.setupPolling();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(journalActions.SetupPolling());
    });
  });

  describe('handleLoadingUI', () => {
    it('should call through to loader service with input and controller options', async () => {
      await component.handleLoadingUI(false);
      expect(loaderService.handleUILoading)
        .toHaveBeenCalledWith(false, loadingOpts);
    });
  });

  describe('showError', () => {
    it('should create a modal instance if there is an error', () => {
      spyOn(component.modalController, 'create')
        .and
        .callThrough();
      const errorMessage: MesError = {
        message: 'Error',
        status: 500,
        statusText: 'Something went wrong',
      };
      component.showError(errorMessage);
      expect(component.modalController.create)
        .toHaveBeenCalledWith({
          component: ErrorPage,
          componentProps: {
            errorType: ErrorTypes.JOURNAL_REFRESH,
          },
          cssClass: 'modal-fullscreen text-zoom-regular',
        });
    });

    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions', async () => {
        spyOn(ScreenOrientation, 'unlock');
        await component.ionViewDidEnter();
        expect(deviceProvider.disableSingleAppMode)
          .toHaveBeenCalled();
        expect(ScreenOrientation.unlock)
          .toHaveBeenCalled();
        expect(insomnia.allowSleepAgain)
          .toHaveBeenCalled();
      });
    });
  });

  describe('DOM', () => {
    // Unit tests for the components template
    let componentEl: DebugElement;

    beforeEach(() => {
      componentEl = fixture.debugElement;

      // Manually dispatching an action which loads slots to the store
      store$.dispatch(
        journalActions.LoadJournalSuccess(
          {
            examiner: {
              staffNumber: '123',
              individualId: 456,
            },
            slotItemsByDate: journalSlotsDataMock,
          },
          ConnectionStatus.ONLINE,
          false,
          new Date(),
        ),
      );
    });

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
    });

    describe('onPreviousDayClick', () => {
      it('should dispatch SelectPreviousDay', () => {
        component.onPreviousDayClick();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(journalActions.SelectPreviousDay());
      });
    });

    describe('onNextDayClick', () => {
      it('should dispatch SelectNextDay', () => {
        component.onNextDayClick();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(journalActions.SelectNextDay());
      });
    });

    describe('loadCompletedTestsWithCallThrough', () => {
      it('should dispatch LoadCompletedTests with true', () => {
        component['loadCompletedTestsWithCallThrough']();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(journalActions.LoadCompletedTests(true));
      });
    });

    describe('ionViewWillEnter', () => {
      it('should run necessary functions', async () => {
        spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
        spyOn(component, 'loadJournalManually')
          .and
          .callThrough();
        spyOn(component, 'setupPolling');
        spyOn(component, 'configurePlatformSubscriptions');
        spyOn(completedTestPersistenceProvider, 'loadCompletedPersistedTests')
          .and
          .callThrough();

        await component.ionViewWillEnter();
        expect(BasePageComponent.prototype.ionViewWillEnter)
          .toHaveBeenCalled();
        expect(component.loadJournalManually)
          .toHaveBeenCalled();
        expect(component.setupPolling)
          .toHaveBeenCalled();
        expect(component.configurePlatformSubscriptions)
          .toHaveBeenCalled();
        expect(completedTestPersistenceProvider.loadCompletedPersistedTests)
          .toHaveBeenCalled();
      });
    });

    describe('refreshJournal', () => {
      it('should run loadJournalManually', async () => {
        spyOn(component, 'loadJournalManually')
          .and
          .callThrough();

        await component.refreshJournal();
        expect(component.loadJournalManually)
          .toHaveBeenCalled();
      });
    });

    describe('pullRefreshJournal', () => {
      it('should run refreshJournal and set pageRefresher to the value passed', async () => {
        spyOn(component, 'refreshJournal')
          .and
          .callThrough();

        await component.pullRefreshJournal({ ionPull: null } as IonRefresher);
        expect(component.refreshJournal)
          .toHaveBeenCalled();
        expect(component.pageRefresher)
          .toEqual({ ionPull: null } as IonRefresher);
      });
    });

    describe('ionViewWillLeave', () => {
      it('should dispatch StopPolling and unsubscribe from a subscription if there is one', () => {
        component.platformSubscription = new Subscription();
        spyOn(component.platformSubscription, 'unsubscribe');
        component.ionViewWillLeave();
        expect(component.platformSubscription.unsubscribe)
          .toHaveBeenCalled();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(journalActions.StopPolling());
      });
    });

    // @TODO: MES-7134 - Come back and look at this test / This is also a TODO in DES3
    xit('there should be one slot for every journal entry', () => {
      const slotsList = componentEl.query(By.css('ion-list'));
      expect(slotsList.children.length)
        .toBe(0);

      fixture.detectChanges();

      let noOfSlotsReturned: number;
      component.pageState.slots$.subscribe((slots) => noOfSlotsReturned = slots.length);

      expect(slotsList.children.length)
        .toBe(noOfSlotsReturned);
      expect(slotsList.children.every((child) => child.name === 'test-slot'))
        .toEqual(true);
    });
  });
});
