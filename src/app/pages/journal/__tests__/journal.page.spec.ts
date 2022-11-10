import {
  ComponentFixture, waitForAsync, TestBed,
} from '@angular/core/testing';
import {
  ModalController,
  Platform,
} from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Subscription } from 'rxjs';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { JournalPage } from '@pages/journal/journal.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { JournalComponentsModule } from '@pages/journal/components/journal-components.module';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { journalReducer } from '@store/journal/journal.reducer';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { SlotProvider } from '@providers/slot/slot';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { CompletedTestPersistenceProvider } from '@providers/completed-test-persistence/completed-test-persistence';
import { CompletedTestPersistenceProviderMock }
  from '@providers/completed-test-persistence/__mocks__/completed-test-persistence.mock';
import { BasePageComponent } from '@shared/classes/base-page';
import * as journalActions from '@store/journal/journal.actions';
import { MesError } from '@shared/models/mes-error.model';
import { ErrorPage } from '@pages/error-page/error';
import { ErrorTypes } from '@shared/models/error-message';
import journalSlotsDataMock from '@store/journal/__mocks__/journal-slots-data.mock';
import { By } from '@angular/platform-browser';
import { DeviceProvider } from '@providers/device/device';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { LoadingProvider } from '@providers/loader/loader';
import { LoaderProviderMock } from '@providers/loader/__mocks__/loader.mock';
import { LoadingOptions } from '@ionic/core';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';

describe('JournalPage', () => {
  let fixture: ComponentFixture<JournalPage>;
  let component: JournalPage;
  let store$: Store<StoreModel>;
  let screenOrientation: ScreenOrientation;
  let insomnia: Insomnia;
  let deviceProvider: DeviceProvider;
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
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: LoadingProvider, useClass: LoaderProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: SlotProvider, useClass: SlotProviderMock },
        { provide: SlotSelectorProvider, useClass: SlotSelectorProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: AppComponent, useClass: MockAppComponent },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
        { provide: CompletedTestPersistenceProvider, useClass: CompletedTestPersistenceProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    fixture = TestBed.createComponent(JournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.subscription = new Subscription();
    screenOrientation = TestBed.inject(ScreenOrientation);
    insomnia = TestBed.inject(Insomnia);
    deviceProvider = TestBed.inject(DeviceProvider);
    store$ = TestBed.inject(Store);
    loaderService = TestBed.inject(LoadingProvider);
    spyOn(store$, 'dispatch');
    spyOn(loaderService, 'handleUILoading');
  }));

  describe('Class', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should dispatch an UnloadJournal action and call base page logout', () => {
      spyOn(BasePageComponent.prototype, 'logout');
      component.logout();
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.UnloadJournal());
      expect(BasePageComponent.prototype.logout).toHaveBeenCalled();
    });
  });

  describe('loadJournalManually', () => {
    it('should dispatch a LoadJournal action', async () => {
      await component.loadJournalManually();
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
        status: 500,
        statusText: 'Something went wrong',
      };
      component.showError(errorMessage);
      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ErrorPage,
        componentProps: {
          errorType: ErrorTypes.JOURNAL_REFRESH,
        },
        cssClass: 'modal-fullscreen text-zoom-regular',
      });
    });

    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions', async () => {
        await component.ionViewDidEnter();
        expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
        expect(screenOrientation.unlock).toHaveBeenCalled();
        expect(insomnia.allowSleepAgain).toHaveBeenCalled();
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
