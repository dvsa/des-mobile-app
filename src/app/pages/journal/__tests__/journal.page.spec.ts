import { HttpStatusCode } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AppComponent } from '@app/app.component';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
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
import { NetworkConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { OrientationMonitorProviderMock } from '@providers/orientation-monitor/__mocks/orientation-monitor.provider.mock';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotProvider } from '@providers/slot/slot';
import { BasePageComponent } from '@shared/classes/base-page';
import { ErrorTypes } from '@shared/models/error-message';
import { MesError } from '@shared/models/mes-error.model';
import { StoreModel } from '@shared/models/store.model';
import { RecallLearnMoreModalOpened } from '@store/general/safety-recall/safety-recall.actions';
import journalSlotsDataMock from '@store/journal/__mocks__/journal-slots-data.mock';
import * as journalActions from '@store/journal/journal.actions';
import { JournalViewDidEnter, RecallAutoPopupDisplayedTimeChanged } from '@store/journal/journal.actions';
import { JournalRehydrationType } from '@store/journal/journal.effects';
import { journalReducer } from '@store/journal/journal.reducer';
import { getRecallAutoPopupLastDisplayedTime } from '@store/journal/journal.selector';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getTests } from '@store/tests/tests.reducer';
import { Subscription, of } from 'rxjs';

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

  beforeEach(() => {
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
        {
          provide: OrientationMonitorProvider,
          useClass: OrientationMonitorProviderMock,
        },
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
  });

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
          NetworkConnectionStatus.ONLINE,
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

    describe('setUpLearnMoreModalDismissed', () => {
      it('sets isDisplayingLearnMoreModal to false when modal is dismissed (promise resolves)', async () => {
        component.isDisplayingLearnMoreModal = true;
        let resolveDismiss: () => void;
        const onDidDismissPromise = new Promise<void>((resolve) => {
          resolveDismiss = resolve;
        });
        const mockModal = { onDidDismiss: () => onDidDismissPromise } as any;

        component.setUpLearnMoreModalDismissed(mockModal);
        expect(component.isDisplayingLearnMoreModal).toBeTrue();

        resolveDismiss();
        await onDidDismissPromise;
        expect(component.isDisplayingLearnMoreModal).toBeFalse();
      });

      it('sets isDisplayingLearnMoreModal to false when modal is dismissed (promise rejects)', async () => {
        component.isDisplayingLearnMoreModal = true;
        const onDidDismissPromise = Promise.reject();
        const mockModal = { onDidDismiss: () => onDidDismissPromise } as any;

        component.setUpLearnMoreModalDismissed(mockModal);
        expect(component.isDisplayingLearnMoreModal).toBeTrue();

        await onDidDismissPromise.catch(() => {});
        expect(component.isDisplayingLearnMoreModal).toBeFalse();
      });
    });

    describe('openLearnMoreModal', () => {
      it('opens modal and dispatches action when not already open', async () => {
        component.isDisplayingLearnMoreModal = false;
        spyOn(component.store$, 'dispatch');
        spyOn(component, 'setUpLearnMoreModalDismissed');
        spyOn(component.accessibilityService, 'getTextZoomClass').and.returnValue('zoom-class');

        const presentSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
        const onDidDismissSpy = jasmine.createSpy().and.returnValue(Promise.resolve());
        spyOn(component.modalController, 'create').and.returnValue(
          Promise.resolve({
            present: presentSpy,
            onDidDismiss: onDidDismissSpy,
          } as any)
        );

        await component.openLearnMoreModal();

        expect(component.isDisplayingLearnMoreModal).toBeTrue();
        expect(component.store$.dispatch).toHaveBeenCalledWith(RecallLearnMoreModalOpened());
        expect(component.modalController.create).toHaveBeenCalled();
        expect(presentSpy).toHaveBeenCalled();
      });

      it('does nothing if modal is already displaying', async () => {
        component.isDisplayingLearnMoreModal = true;
        spyOn(component.modalController, 'create');

        await component.openLearnMoreModal();

        expect(component.modalController.create).not.toHaveBeenCalled();
      });
    });

    describe('displayAutoRecallPopup', () => {
      beforeEach(() => {
        component.todaysDate = jasmine.createSpyObj('DateTime', ['format']);
        spyOn(component.todaysDate, 'format').and.returnValue('01/01/2024');
        component.pageState = { ...component.pageState, isSelectedDateToday$: of(true) } as any;
        spyOn(component, 'openLearnMoreModal').and.returnValue(Promise.resolve());
        spyOn(component.store$, 'dispatch');
      });

      it('dispatches RecallAutoPopupDisplayedTimeChanged and opens modal when slot has affected category, has not been conducted and not already displayed today', async () => {
        component.store$.selectSignal = jasmine.createSpy().and.callFake((selector) => {
          if (selector === getRecallAutoPopupLastDisplayedTime) return () => 'not-today';
          if (selector === getTests) return () => ({ testStatus: {} });
        });

        const slots = [
          {
            slotData: {
              slotDetail: { slotId: '1' },
              booking: { application: { testCategory: TestCategory.B } },
            },
          } as any,
        ];

        await component.displayAutoRecallPopup(slots);

        expect(component.store$.dispatch).toHaveBeenCalledWith(RecallAutoPopupDisplayedTimeChanged('01/01/2024'));
        expect(component.openLearnMoreModal).toHaveBeenCalled();
      });

      it('does not open modal if slots array is empty', async () => {
        await component.displayAutoRecallPopup([]);
        expect(component.openLearnMoreModal).not.toHaveBeenCalled();
      });

      it('does not open modal if selected date is not today', async () => {
        component.pageState = { ...component.pageState, isSelectedDateToday$: of(false) } as any;
        await component.displayAutoRecallPopup([
          {
            slotData: {
              slotDetail: { slotId: '1' },
              booking: { application: { testCategory: TestCategory.B } },
            },
          } as any,
        ]);
        expect(component.openLearnMoreModal).not.toHaveBeenCalled();
      });

      it('does not dispatch or open modal if popup already displayed today', async () => {
        component.store$.selectSignal = jasmine.createSpy().and.callFake((selector) => {
          if (selector === getRecallAutoPopupLastDisplayedTime) return () => '01/01/2024';
          if (selector === getTests) return () => ({ testStatus: {} });
        });

        await component.displayAutoRecallPopup([
          {
            slotData: {
              slotDetail: { slotId: '1' },
              booking: { application: { testCategory: TestCategory.B } },
            },
          } as any,
        ]);

        expect(component.store$.dispatch).not.toHaveBeenCalledWith(RecallAutoPopupDisplayedTimeChanged('01/01/2024'));
        expect(component.openLearnMoreModal).not.toHaveBeenCalled();
      });

      it('does not dispatch or open modal if no slots have affected categories', async () => {
        component.store$.selectSignal = jasmine.createSpy().and.callFake((selector) => {
          if (selector === getRecallAutoPopupLastDisplayedTime) return () => 'not-today';
          if (selector === getTests) return () => ({ testStatus: {} });
        });

        await component.displayAutoRecallPopup([
          {
            slotData: {
              slotDetail: { slotId: '1' },
              booking: { application: { testCategory: 'OTHER' } },
            },
          } as any,
        ]);

        expect(component.store$.dispatch).not.toHaveBeenCalledWith(RecallAutoPopupDisplayedTimeChanged('01/01/2024'));
        expect(component.openLearnMoreModal).not.toHaveBeenCalled();
      });

      it('handles multiple slots and only displays popup if at least one is affected and incomplete', async () => {
        component.store$.selectSignal = jasmine.createSpy().and.callFake((selector) => {
          if (selector === getRecallAutoPopupLastDisplayedTime) return () => 'not-today';
          if (selector === getTests)
            return () => ({
              testStatus: {
                '1': undefined,
                '2': TestStatus.Completed,
                '3': undefined,
              },
            });
        });

        const slots = [
          {
            slotData: { slotDetail: { slotId: '1' }, booking: { application: { testCategory: TestCategory.ADI2 } } },
          } as any,
          {
            slotData: { slotDetail: { slotId: '2' }, booking: { application: { testCategory: TestCategory.B } } },
          } as any,
          { slotData: { slotDetail: { slotId: '3' }, booking: { application: { testCategory: 'OTHER' } } } } as any,
        ];

        await component.displayAutoRecallPopup(slots);

        expect(component.store$.dispatch).toHaveBeenCalledWith(RecallAutoPopupDisplayedTimeChanged('01/01/2024'));
        expect(component.openLearnMoreModal).toHaveBeenCalled();
      });

      it('does not display popup if all affected slots are completed, autosaved, or submitted', async () => {
        component.store$.selectSignal = jasmine.createSpy().and.callFake((selector) => {
          if (selector === getRecallAutoPopupLastDisplayedTime) return () => 'not-today';
          if (selector === getTests)
            return () => ({
              testStatus: {
                '1': TestStatus.Completed,
                '2': TestStatus.Autosaved,
                '3': TestStatus.Submitted,
              },
            });
        });

        const slots = [
          {
            slotData: { slotDetail: { slotId: '1' }, booking: { application: { testCategory: TestCategory.ADI2 } } },
          } as any,
          {
            slotData: { slotDetail: { slotId: '2' }, booking: { application: { testCategory: TestCategory.B } } },
          } as any,
          {
            slotData: { slotDetail: { slotId: '3' }, booking: { application: { testCategory: TestCategory.SC } } },
          } as any,
        ];

        await component.displayAutoRecallPopup(slots);

        expect(component.store$.dispatch).not.toHaveBeenCalledWith(RecallAutoPopupDisplayedTimeChanged('01/01/2024'));
        expect(component.openLearnMoreModal).not.toHaveBeenCalled();
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
