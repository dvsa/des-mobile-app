import { HttpStatusCode } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AppComponent } from '@app/app.component';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { ModalController, Platform, RefresherEventDetail } from '@ionic/angular';
import { IonRefresherCustomEvent, LoadingOptions } from '@ionic/core';
import { ActivatedRouteMock, ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { ErrorPage } from '@pages/error-page/error';
import { JournalComponentsModule } from '@pages/journal/components/journal-components.module';
import { JournalPage } from '@pages/journal/journal.page';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LoaderProviderMock } from '@providers/loader/__mocks__/loader.mock';
import { LoadingProvider } from '@providers/loader/loader';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotProvider } from '@providers/slot/slot';
import { BasePageComponent } from '@shared/classes/base-page';
import { ErrorTypes } from '@shared/models/error-message';
import { MesError } from '@shared/models/mes-error.model';
import { StoreModel } from '@shared/models/store.model';
import journalSlotsDataMock from '@store/journal/__mocks__/journal-slots-data.mock';
import * as journalActions from '@store/journal/journal.actions';
import { JournalViewDidEnter } from '@store/journal/journal.actions';
import { JournalRehydrationType } from '@store/journal/journal.effects';
import { journalReducer } from '@store/journal/journal.reducer';
import { Subscription } from 'rxjs';

describe('JournalPage', () => {
  let fixture: ComponentFixture<JournalPage>;
  let component: JournalPage;
  let store$: Store<StoreModel>;
  let loaderService: LoadingProvider;
  const loadingOpts: LoadingOptions = {
    id: 'journal_loading_spinner',
    spinner: 'circles',
    backdropDismiss: true,
    translucent: false,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [JournalPage],
      imports: [
        RouterModule.forRoot([]),
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
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteMock,
        },
      ],
    });

    fixture = TestBed.createComponent(JournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.subscription = new Subscription();
    store$ = TestBed.inject(Store);
    loaderService = TestBed.inject(LoadingProvider);
    spyOn(store$, 'dispatch');
    spyOn(loaderService, 'handleUILoading');
    spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
  }));

  describe('Class', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('requestJournal', () => {
    it('should dispatch a LoadJournal action', async () => {
      await component.requestJournal(JournalRehydrationType.MANUAL);
      expect(loaderService.handleUILoading).toHaveBeenCalledWith(true, loadingOpts);
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.LoadJournal());
    });
  });

  describe('setupPolling', () => {
    it('should dispatch a setupPolling action', () => {
      component.setupPolling();
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.SetupPolling());
    });
  });

  describe('handleLoadingUI', () => {
    it('should call through to loader service with input and controller options', async () => {
      await component.handleLoadingUI(false);
      expect(loaderService.handleUILoading).toHaveBeenCalledWith(false, loadingOpts);
    });
  });

  describe('showError', () => {
    it('should create a modal instance if there is an error', () => {
      spyOn(component.modalController, 'create').and.callThrough();
      const errorMessage: MesError = {
        message: 'Error',
        status: HttpStatusCode.InternalServerError,
        statusText: 'Something went wrong',
      };
      component.showError(errorMessage);
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ErrorPage,
        componentProps: {
          errorType: ErrorTypes.JOURNAL_REFRESH,
          displayAsModal: true,
        },
        cssClass: 'modal-fullscreen text-zoom-regular',
      });
    });

    describe('ionViewDidEnter', () => {
      it('should call through to base page unlock method', async () => {
        spyOn(BasePageComponent.prototype, 'unlockDevice');
        await component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(JournalViewDidEnter());
        expect(BasePageComponent.prototype.unlockDevice).toHaveBeenCalled();
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
          new Date()
        )
      );
    });

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('onPreviousDayClick', () => {
      it('should dispatch SelectPreviousDay', () => {
        component.onPreviousDayClick();
        expect(store$.dispatch).toHaveBeenCalledWith(journalActions.SelectPreviousDay());
      });
    });

    describe('onNextDayClick', () => {
      it('should dispatch SelectNextDay', () => {
        component.onNextDayClick();
        expect(store$.dispatch).toHaveBeenCalledWith(journalActions.SelectNextDay());
      });
    });

    describe('ionViewWillEnter', () => {
      it('should run necessary functions', async () => {
        spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
        spyOn(component, 'requestJournal').and.callThrough();
        spyOn(component, 'setupPolling');
        spyOn(component, 'configurePlatformSubscriptions');

        await component.ionViewWillEnter();
        expect(BasePageComponent.prototype.ionViewWillEnter).toHaveBeenCalled();
        expect(component.requestJournal).toHaveBeenCalled();
        expect(component.setupPolling).toHaveBeenCalled();
        expect(component.configurePlatformSubscriptions).toHaveBeenCalled();
      });
    });

    describe('refreshJournal', () => {
      it('should run requestJournal', async () => {
        spyOn(component, 'requestJournal').and.callThrough();

        await component.refreshJournal(JournalRehydrationType.MANUAL);
        expect(component.requestJournal).toHaveBeenCalled();
      });
    });

    describe('pullRefreshJournal', () => {
      it('should run refreshJournal and set pageRefresher to the value passed', async () => {
        spyOn(component, 'refreshJournal').and.callThrough();

        const event = { target: {} } as IonRefresherCustomEvent<RefresherEventDetail>;

        await component.pullRefreshJournal(event);
        expect(component.refreshJournal).toHaveBeenCalled();
        expect(component.pageRefresher).toEqual(event);
      });
    });

    describe('ionViewWillLeave', () => {
      it('should dispatch StopPolling and unsubscribe from a subscription if there is one', () => {
        component.platformSubscription = new Subscription();
        spyOn(component.platformSubscription, 'unsubscribe');
        component.ionViewWillLeave();
        expect(component.platformSubscription.unsubscribe).toHaveBeenCalled();
        expect(store$.dispatch).toHaveBeenCalledWith(journalActions.StopPolling());
      });
    });

    // @TODO: MES-7134 - Come back and look at this test / This is also a TODO in DES3
    xit('there should be one slot for every journal entry', () => {
      const slotsList = componentEl.query(By.css('ion-list'));
      expect(slotsList.children.length).toBe(0);

      fixture.detectChanges();

      let noOfSlotsReturned: number;
      component.pageState.slots$.subscribe((slots) => (noOfSlotsReturned = slots.length));

      expect(slotsList.children.length).toBe(noOfSlotsReturned);
      expect(slotsList.children.every((child) => child.name === 'test-slot')).toEqual(true);
    });
  });
});
